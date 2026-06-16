type:: project
status:: planning
tags:: #adsb #cyberdeck #rf #sdr #flask
updated:: 2026-06-16

# ADS-B App

> Custom Flask ADS-B aircraft tracking app for Cyberdeck. Replaces dump1090-mutability's default web UI (which requires lighttpd). Reads decoded aircraft JSON from dump1090 and displays it on a Leaflet map. Matches CD dark/amber aesthetic.

## State

| **Label** | value |
|---|---|
| **Status** | Planning / brainstorm |
| **Port** | :5300 (tentative) |
| **Decoder** | dump1090-mutability (existing) |
| **CD path** | ~/Projects/adsb-app/ |
| **Repo** | https://github.com/Slofi/ADS-B-app.git |

## Why

dump1090-mutability's built-in web UI requires lighttpd to serve its static files at `http://localhost/dump1090/`. lighttpd is not configured or running on CD. Rather than maintain a separate web server just for ADS-B, build a custom app in the same Flask/Leaflet pattern as Sonde App and Map App.

## Architecture

dump1090 does all the hard work (signal decoding). Our app just consumes its output.

```
RTL-SDR hardware (1090 MHz)
    ↓
dump1090-mutability  ← signal demodulation, Mode S/ADS-B decoding, aircraft state tracking
    ↓ writes every 1s
/run/dump1090-mutability/aircraft.json   ← all seen aircraft + positions
/run/dump1090-mutability/receiver.json  ← receiver position, stats
    ↓
Our Flask app (:5300) reads JSON, serves via SSE or polling
    ↓
Leaflet map frontend  ← aircraft markers, click popups, filters
```

## Data available from dump1090

Each aircraft in `aircraft.json`:
- `hex` — ICAO 24-bit address (unique per aircraft)
- `flight` — callsign / flight number (e.g. LJU123)
- `lat` / `lon` — position (only when CPR lock acquired)
- `altitude` — barometric altitude in feet
- `speed` — ground speed in knots
- `track` — heading in degrees
- `vert_rate` — climb/descent rate ft/min
- `squawk` — Mode A squawk code
- `rssi` — signal strength (dBFS)
- `seen` — seconds since last message
- `seen_pos` — seconds since last position update
- `messages` — total messages received from this aircraft

`receiver.json`:
- `lat` / `lon` — receiver position (our position)
- `version`, `refresh` interval

## UI Layout

```
+--------------------------------------------------------+
|  ✈ ADS-B  |  12 aircraft · max 187km · [■ dump1090]  |  ⚙
+-------------------+--------------------+---------------+
|                   |                    | [ Active | History ]
|  LEFT PANEL       |                    |  callsign  alt  dist
|  (collapsible)    |                    |  ────────────────
|  ★ Saved Flights  |      MAP           |  LJU231   FL320  42km ▲
|  ──────────────   |   (Leaflet)        |  QTR006   FL380  88km →
|  Flight 1  GPX↓  |                    |  OE-LGN   3400   12km ▼
|  Flight 2  GPX↓  |                    |  [mil] HRZ101  8200   31km
|  ...              |                    |  ────────────────
|                   |                    |  (click → highlight
|                   |                    |   + map popup)
+-------------------+--------------------+---------------+
```

**Consistent with:** Sonde App, OM, OPS-TOC — dark bg, amber accent, same header/settings pattern.

## Aircraft Icons

**Source:** `/usr/share/dump1090-mutability/html/markers.js` — inline SVG path strings, no image files needed. Confirmed 5 icon types:

| Variable | Icon | Used for |
|----------|------|----------|
| `_beechcraft_svg` | Small prop aircraft | L1P, L2P (light prop) |
| `_generic_plane_svg` | Generic medium plane | fallback for unknowns |
| `_a320` | Narrow-body jet | L2J medium (A320, B737, etc.) |
| `_heavy_svg` | Wide-body / heavy | L4J, H size class |
| `_rotorcraft_svg` | Helicopter | H prefix type codes |

- Derive icon from DB `config` field: first char = L/H/G/A, last char = P(prop)/J(jet)/T(turbine)
- Rendered as inline `<svg>` in Leaflet `divIcon` — colored with CSS `fill`, rotated with `transform: rotate(Xdeg)` matching aircraft `track`
- Size scaling: L=small, M=medium, H=large via SVG `width`/`height`

## Altitude Coloring

Applied to the icon + list row accent, not background:

| Range | Color | Notes |
|-------|-------|-------|
| 0 – 5,000 ft | Red-orange `#ff5533` | Low — light aircraft, approach |
| 5,000 – 18,000 ft | Yellow `#f0c040` | Medium — regional, climb/descent |
| 18,000 – 30,000 ft | Lime `#9fda50` | High — cruise (narrowbody) |
| > 30,000 ft | Green `#3ddc84` | Very high — long-haul cruise |
| No altitude | Grey `#7a8aaa` | No data |
| Military (DB flag `'10'`) | Blue `#38bdf8` | Overrides altitude color |
| Emergency squawk | Red flash `#ff2222` | 7700/7600/7500 — overrides everything |

## Features

### Map
- [ ] Aircraft icons (rotated SVGs, type + size differentiated)
- [ ] Altitude color coding (icon tint + border)
- [ ] Trail lines from first detection — fading opacity as position ages
- [ ] Trail fades to grey + dashed when aircraft "gone" (not seen 60s+)
- [ ] Range rings — configurable distances (50/100/200km), toggleable
- [ ] Click aircraft marker → popup (see below)
- [ ] Follow mode — map auto-centers on selected aircraft as it moves; cancels on manual pan
- [ ] Offline MBTiles via shared tile server (:8092)
- [ ] Receiver position marker (CD location dot)

### Aircraft popup (on click/tap)
- Callsign + registration + full type name (from DB)
- Altitude, speed, heading, vert_rate (with ▲▼ symbol)
- Distance from CD (haversine, updated live)
- Squawk, RSSI, message count, first seen
- **Buttons:**
  - Center — snap map to aircraft
  - Follow — toggle auto-follow
  - Save Flight — flag for permanent keep + GPX export on end
  - (future) Listen — open Intercept at relevant ATC freq

### Right panel — aircraft list
- Two tabs: **Active** | **History**
- Active: currently seen (within last 60s)
- History: disappeared this session — auto-kept with full track
- Columns: icon, callsign/reg, altitude (colored), speed, distance, age
- Sortable: distance (default), altitude, callsign
- Climb/descent indicator ▲▼ when |vert_rate| > 500 ft/min
- Click row → same as clicking map marker (highlight + popup)
- Military / emergency badge in row

### Left panel — Saved Flights (collapsible)
- Flights explicitly saved via "Save Flight" button
- Kept permanently (session + across restarts, stored in SQLite)
- Shows: callsign, date, duration, max altitude, distance
- GPX export button per flight
- Delete button

### Emergency alerts
- Squawk 7700/7600/7500 → red flash on marker, audio beep, bell panel alert
- Stays flagged even after squawk changes

### Header stats strip
- Active aircraft count
- Farthest currently tracked (distance + callsign)
- Max range seen today (resets at midnight)
- dump1090 status dot (green=running, red=stopped)

### Settings (gear button, same pattern as launcher/OM)
- Accent color picker
- Range rings: toggle + distances
- Trail length (how many points to keep per aircraft)
- "Gone" timeout (default 60s before moving to History)
- Saved flight retention timeout (default: 5min after gone)
- Aircraft DB: last updated date + "Update DB" button
  → downloads Mictronics readsb-protobuf release
  → saves to `~/Projects/adsb-app/data/aircraft_db.json`
  → copies to `/home/slofi/intercept/data/adsb/aircraft_db.json` (updates Intercept too)
- In-app update (git pull + restart), same as Sonde/OM
- Restart dump1090 / Release RTL-SDR buttons

### V1 scope decisions
- **Left panel (Saved Flights):** deferred — session-only history is enough for v1
- **Saved flights persistence:** SQLite, kept across restarts — minimal table: callsign, first_seen, track JSON, max_alt, notes
- **Session history:** in-memory only — lost on restart, that's fine
- **DB:** read from Intercept's path, update writes back to same path

### Probably not in v1
- MLAT (needs multiple receivers)
- ACARS (already in Intercept)
- Intercept "Listen" button (future)
- ATC frequency overlay
- Left panel saved flights view (deferred)

## Aircraft DB

**Source:** Mictronics readsb-protobuf — same DB Intercept already uses.
**Format:** `{aircraft: {HEX: [reg, type_code, country_flags]}, types: {code: [name, config, size]}}`
**Primary location:** `/home/slofi/intercept/data/adsb/aircraft_db.json` (15MB, version 2026-06-14)

**Confirmed download URLs** (from Intercept's `utils/aircraft_db.py`):
- Aircraft: `https://raw.githubusercontent.com/Mictronics/readsb-protobuf/dev/webapp/src/db/aircrafts.json`
- Types: `https://raw.githubusercontent.com/Mictronics/readsb-protobuf/dev/webapp/src/db/types.json`
- Version check: GitHub API `commits?path=webapp/src/db/aircrafts.json&per_page=1`

**Update strategy:**
- V1: read from Intercept's path directly (already present, no extra copy needed)
- "Update DB" button: downloads fresh from above URLs → saves to Intercept's path → reloads into memory
- One update refreshes both apps
- Show last updated date from `aircraft_db_meta.json`
- Military flag: `aircraft[hex][2] == '10'` → blue color override

**Lookup:** `aircraft[hex.toUpperCase()]` → `[reg, type_code, country]` → `types[type_code]` → full name
**Size categories:** L=light, M=medium, H=heavy (can drive marker size on map)

## Technical Notes

- **Port:** `:5300` (sonde=:5100, map=:8090, om=:8082, launcher=:8080)
- **Update loop:** Backend reads `/run/dump1090-mutability/aircraft.json` every 1s, maintains state, pushes via SSE — same pattern as Sonde App
- **Icons:** Reuse `/usr/share/dump1090-mutability/html/images/` — already on CD, correct formats, no duplication
- **DB lookup:** Load `aircraft_db.json` into RAM at startup (dict, ~15MB, instant lookup). Refresh in-memory dict after DB update without restart.
- **Receiver position:** Read `receiver.json` for lat/lon, fall back to gpsd/OPS-TOC GPS API
- **Flight storage:** SQLite (`adsb_app.db`) — `flights` table for saved tracks, `history` table for session tracks
- **Military detection:** `aircraft[hex][2] == '10'` in Mictronics DB
- **Gone timeout:** Aircraft absent from `aircraft.json` for >60s → move to History, start "gone" trail fade

## Changelog

**2026-06-16** — Project created, brainstorm complete, ready to build (Session 341)
