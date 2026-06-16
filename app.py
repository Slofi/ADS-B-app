#!/usr/bin/env python3
"""ADS-B App — Flask backend for aircraft tracking on Cyberdeck."""

import json
import math
import os
import subprocess
import threading
import time
import urllib.request
from datetime import datetime

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
AIRCRAFT_JSON   = '/run/dump1090-mutability/aircraft.json'
RECEIVER_JSON   = '/run/dump1090-mutability/receiver.json'
DB_FILE         = '/home/slofi/intercept/data/adsb/aircraft_db.json'
DB_META_FILE    = '/home/slofi/intercept/data/adsb/aircraft_db_meta.json'

AIRCRAFT_DB_URL = 'https://raw.githubusercontent.com/Mictronics/readsb-protobuf/dev/webapp/src/db/aircrafts.json'
TYPES_DB_URL    = 'https://raw.githubusercontent.com/Mictronics/readsb-protobuf/dev/webapp/src/db/types.json'
GITHUB_API_URL  = 'https://api.github.com/repos/Mictronics/readsb-protobuf/commits?path=webapp/src/db/aircrafts.json&per_page=1'

POLL_INTERVAL   = 1.0    # seconds between aircraft.json reads
GONE_TIMEOUT    = 60.0   # seconds before gone aircraft moves to history
MAX_TRACK_PTS   = 300    # max stored track points per aircraft
MAX_HISTORY     = 50     # max history entries (oldest dropped)

EMERGENCY_SQUAWKS = {'7700', '7600', '7500'}

# ---------------------------------------------------------------------------
# State
# ---------------------------------------------------------------------------
_lock     = threading.Lock()
_aircraft = {}   # hex → dict  (active)
_history  = {}   # hex → dict  (gone, session-only)
_receiver = {}   # {lat, lon, version}

_db_aircraft: dict = {}
_db_types:    dict = {}
_db_loaded    = False

# ---------------------------------------------------------------------------
# Aircraft DB
# ---------------------------------------------------------------------------
def _load_db() -> bool:
    global _db_aircraft, _db_types, _db_loaded
    if not os.path.exists(DB_FILE):
        return False
    try:
        with open(DB_FILE) as f:
            d = json.load(f)
        _db_aircraft = d.get('aircraft', {})
        _db_types    = d.get('types', {})
        _db_loaded   = True
        return True
    except Exception:
        return False

def _db_lookup(hex_code: str) -> dict:
    if not _db_loaded:
        return {}
    entry = _db_aircraft.get(hex_code.upper())
    if not entry or not isinstance(entry, list):
        return {}

    reg       = entry[0] if len(entry) > 0 else ''
    type_code = entry[1] if len(entry) > 1 else ''
    flags     = entry[2] if len(entry) > 2 else '00'

    type_info  = _db_types.get(type_code) or []
    type_name  = type_info[0] if len(type_info) > 0 else ''
    config     = type_info[1] if len(type_info) > 1 else ''
    size       = type_info[2] if len(type_info) > 2 else ''

    # Derive icon type from ICAO config code (e.g. L2J, H2T, L1P)
    icon_type = 'generic'
    if config:
        vt = config[0]          # L=land, H=heli, G=glider
        ec = config[-1]         # P=prop, J=jet, T=turbine
        if vt == 'H':
            icon_type = 'helicopter'
        elif ec == 'P':
            icon_type = 'prop'
        elif ec in ('J', 'T'):
            icon_type = 'heavy' if size == 'H' else 'jet'

    return {
        'registration': reg,
        'type_code':    type_code,
        'type_name':    type_name,
        'config':       config,
        'size':         size,
        'icon_type':    icon_type,
        'is_military':  flags == '10',
    }

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _haversine(lat1, lon1, lat2, lon2) -> float:
    R = 6371.0
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat / 2) ** 2
         + math.cos(math.radians(lat1))
         * math.cos(math.radians(lat2))
         * math.sin(d_lon / 2) ** 2)
    return R * 2 * math.asin(math.sqrt(max(0.0, min(1.0, a))))

def _is_dump1090_running() -> bool:
    r = subprocess.run(
        ['systemctl', 'is-active', 'dump1090-mutability'],
        capture_output=True, text=True
    )
    return r.stdout.strip() == 'active'

def _new_aircraft(hex_code: str, now: float) -> dict:
    info = _db_lookup(hex_code)
    return {
        'hex':          hex_code,
        'flight':       '',
        'lat':          None,
        'lon':          None,
        'altitude':     None,
        'speed':        None,
        'track':        None,
        'vert_rate':    None,
        'squawk':       None,
        'rssi':         None,
        'messages':     0,
        'registration': info.get('registration', ''),
        'type_code':    info.get('type_code', ''),
        'type_name':    info.get('type_name', ''),
        'config':       info.get('config', ''),
        'size':         info.get('size', ''),
        'icon_type':    info.get('icon_type', 'generic'),
        'is_military':  info.get('is_military', False),
        'emergency':    False,
        'track_points': [],   # [[lat, lon, alt], ...]
        'first_seen':   now,
        'last_seen':    now,
        'gone':         False,
        'gone_at':      None,
        'distance':     None,
    }

# ---------------------------------------------------------------------------
# Background polling loop
# ---------------------------------------------------------------------------
def _poll():
    while True:
        try:
            _update_state()
        except Exception:
            pass
        time.sleep(POLL_INTERVAL)

def _update_state():
    now = time.time()

    # Receiver position
    if os.path.exists(RECEIVER_JSON):
        try:
            with open(RECEIVER_JSON) as f:
                global _receiver
                _receiver = json.load(f)
        except Exception:
            pass

    if not os.path.exists(AIRCRAFT_JSON):
        return

    with open(AIRCRAFT_JSON) as f:
        feed = json.load(f)

    rlat = _receiver.get('lat')
    rlon = _receiver.get('lon')
    current_hexes: set = set()

    for ac in feed.get('aircraft', []):
        hex_code = (ac.get('hex') or '').lower()
        if not hex_code:
            continue
        current_hexes.add(hex_code)

        with _lock:
            obj = _aircraft.get(hex_code)
            if obj is None:
                obj = _new_aircraft(hex_code, now)
                _aircraft[hex_code] = obj

            # Update scalar fields
            if ac.get('flight'):
                obj['flight'] = ac['flight'].strip()
            for fld in ('lat', 'lon', 'altitude', 'speed', 'track',
                        'vert_rate', 'squawk', 'rssi', 'messages'):
                if ac.get(fld) is not None:
                    obj[fld] = ac[fld]

            obj['last_seen'] = now
            obj['gone']      = False
            obj['gone_at']   = None
            obj['emergency'] = obj.get('squawk') in EMERGENCY_SQUAWKS

            # Distance from receiver
            if rlat and rlon and obj['lat'] and obj['lon']:
                obj['distance'] = round(_haversine(rlat, rlon, obj['lat'], obj['lon']), 1)

            # Track point (only when we have a position)
            if obj['lat'] is not None and obj['lon'] is not None:
                pts = obj['track_points']
                last = pts[-1] if pts else None
                if last is None or last[0] != obj['lat'] or last[1] != obj['lon']:
                    pts.append([obj['lat'], obj['lon'], obj.get('altitude')])
                    if len(pts) > MAX_TRACK_PTS:
                        del pts[0]

    # Gone detection
    with _lock:
        for hex_code in list(_aircraft):
            if hex_code in current_hexes:
                continue
            obj = _aircraft[hex_code]
            if not obj['gone']:
                obj['gone']    = True
                obj['gone_at'] = now
            elif now - obj['gone_at'] >= GONE_TIMEOUT:
                _history[hex_code] = _aircraft.pop(hex_code)
                if len(_history) > MAX_HISTORY:
                    oldest = min(_history, key=lambda h: _history[h].get('gone_at', 0))
                    del _history[oldest]

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/aircraft')
def get_aircraft():
    with _lock:
        active  = list(_aircraft.values())
        history = list(_history.values())

    # Stats
    farthest = None
    max_dist = 0.0
    for ac in active:
        d = ac.get('distance') or 0
        if d > max_dist:
            max_dist = d
            farthest = {
                'hex':      ac['hex'],
                'flight':   ac.get('flight') or ac.get('registration') or ac['hex'],
                'distance': d,
            }

    return jsonify({
        'active':           active,
        'history':          history,
        'receiver':         _receiver,
        'dump1090_running': _is_dump1090_running(),
        'stats': {
            'active_count':  len(active),
            'history_count': len(history),
            'farthest':      farthest,
        },
        'timestamp': time.time(),
    })

@app.route('/api/dump1090/start', methods=['POST'])
def d1090_start():
    r = subprocess.run(['sudo', 'systemctl', 'start', 'dump1090-mutability'], capture_output=True)
    return jsonify({'ok': r.returncode == 0})

@app.route('/api/dump1090/stop', methods=['POST'])
def d1090_stop():
    r = subprocess.run(['sudo', 'systemctl', 'stop', 'dump1090-mutability'], capture_output=True)
    return jsonify({'ok': r.returncode == 0})

@app.route('/api/dump1090/restart', methods=['POST'])
def d1090_restart():
    r = subprocess.run(['sudo', 'systemctl', 'restart', 'dump1090-mutability'], capture_output=True)
    return jsonify({'ok': r.returncode == 0})

@app.route('/api/db/status')
def db_status():
    meta: dict = {}
    if os.path.exists(DB_META_FILE):
        try:
            with open(DB_META_FILE) as f:
                meta = json.load(f)
        except Exception:
            pass
    return jsonify({
        'loaded':          _db_loaded,
        'aircraft_count':  len(_db_aircraft),
        'version':         meta.get('version'),
        'downloaded':      meta.get('downloaded'),
    })

@app.route('/api/system/update', methods=['POST'])
def system_update():
    repo_dir = os.path.dirname(os.path.abspath(__file__))
    r = subprocess.run(
        ['git', '-C', repo_dir, 'pull', 'origin', 'main'],
        capture_output=True, text=True
    )
    if r.returncode != 0:
        return jsonify({'ok': False, 'error': r.stderr.strip()}), 500

    def _restart():
        time.sleep(1.5)
        subprocess.run(['systemctl', '--user', 'restart', 'adsb-app'])

    threading.Thread(target=_restart, daemon=True).start()
    return jsonify({'ok': True, 'output': r.stdout.strip()})

@app.route('/api/db/update', methods=['POST'])
def db_update():
    def fetch(url: str):
        req = urllib.request.Request(url, headers={'User-Agent': 'ADS-B-App/1.0'})
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode('utf-8'))
    try:
        aircraft_data = fetch(AIRCRAFT_DB_URL)
        types_data    = fetch(TYPES_DB_URL)
        combined      = {'aircraft': aircraft_data, 'types': types_data}

        with open(DB_FILE, 'w') as f:
            json.dump(combined, f, separators=(',', ':'))

        # Get version string from GitHub API
        version = datetime.utcnow().strftime('%Y-%m-%d')
        try:
            req = urllib.request.Request(GITHUB_API_URL, headers={'User-Agent': 'ADS-B-App/1.0'})
            with urllib.request.urlopen(req, timeout=10) as r:
                commits = json.loads(r.read().decode('utf-8'))
                if commits:
                    sha  = commits[0]['sha'][:8]
                    date = commits[0]['commit']['committer']['date'][:10]
                    version = f'{date}_{sha}'
        except Exception:
            pass

        meta = {'version': version, 'downloaded': datetime.utcnow().isoformat() + 'Z'}
        with open(DB_META_FILE, 'w') as f:
            json.dump(meta, f, indent=2)

        _load_db()   # reload into memory
        return jsonify({'ok': True, 'version': version, 'aircraft_count': len(_db_aircraft)})
    except Exception as exc:
        return jsonify({'ok': False, 'error': str(exc)}), 500

# ---------------------------------------------------------------------------
# Boot
# ---------------------------------------------------------------------------
_load_db()
threading.Thread(target=_poll, daemon=True).start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5400, debug=False)
