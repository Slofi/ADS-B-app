'use strict';

// ─── SVG Icon Paths (from dump1090-mutability markers.js) ───────────────────
// Paths point nose-up (north = 0°). CSS rotation applied per aircraft track.

const ICON_DEFS = {
  jet: {
    // A320-style narrow-body jet
    path: 'm 32,1 2,1 2,3 0,18 4,1 0,-4 3,0 0,5 17,6 0,3 -15,-2 -9,0 0,12 -2,6 7,3 0,2 -8,-1 -1,2 -1,-2 -8,1 0,-2 7,-3 -2,-6 0,-12 -9,0 -15,2 0,-3 17,-6 0,-5 3,0 0,4 4,-1 0,-18 2,-3 2,-1z',
    vb: '0 0 64 64', w: 32, h: 32, anchor: [16, 14],
  },
  heavy: {
    // B777-style wide-body
    path: 'm 32,1 2,1 1,2 0,20 4,4 0,-4 3,0 0,4 -1,2 17,12 0,2 -16,-5 -7,0 0,13 -1,5 7,5 0,2 -8,-2 -1,2 -1,-2 -8,2 0,-2 7,-5 -1,-5 0,-13 -7,0 -16,5 0,-2 17,-12 -1,-2 0,-4 3,0 0,4 4,-4 0,-20 1,-2 2,-1z',
    vb: '0 0 64 64', w: 38, h: 38, anchor: [19, 19],
  },
  prop: {
    // Generic prop / small GA — simplified generic shape
    path: 'M 1.9565564,41.694305 C 1.7174505,40.497708 1.6419973,38.448747 1.8096508,37.70494 1.8936398,37.332056 2.0796653,36.88191 2.222907,36.70461 2.4497603,36.423844 4.087816,35.47248 14.917931,29.331528 l 12.434577,-7.050718 -0.04295,-7.613412 c -0.03657,-6.4844888 -0.01164,-7.7625804 0.168134,-8.6194061 0.276129,-1.3160905 0.762276,-2.5869575 1.347875,-3.5235502 l 0.472298,-0.7553719 1.083746,-0.6085497 c 1.194146,-0.67053522 1.399524,-0.71738842 2.146113,-0.48960552 1.077005,0.3285939 2.06344,1.41299352 2.797602,3.07543322 0.462378,1.0469993 0.978731,2.7738408 1.047635,3.5036272 0.02421,0.2570284 0.06357,3.78334 0.08732,7.836246 0.02375,4.052905 0.0658,7.409251 0.09345,7.458546 0.02764,0.04929 5.600384,3.561772 12.38386,7.805502 l 12.333598,7.715871 0.537584,0.959688 c 0.626485,1.118378 0.651686,1.311286 0.459287,3.516442 -0.175469,2.011604 -0.608966,2.863924 -1.590344,3.127136 -0.748529,0.200763 -1.293144,0.03637 -10.184829,-3.07436 C 48.007733,41.72562 44.793806,40.60197 43.35084,40.098045 l -2.623567,-0.916227 -1.981212,-0.06614 c -1.089663,-0.03638 -1.985079,-0.05089 -1.989804,-0.03225 -0.0052,0.01863 -0.02396,2.421278 -0.04267,5.339183 -0.0395,6.147742 -0.143635,7.215456 -0.862956,8.845475 l -0.300457,0.680872 2.91906,1.361455 c 2.929379,1.366269 3.714195,1.835385 4.04589,2.41841 0.368292,0.647353 0.594634,2.901439 0.395779,3.941627 -0.0705,0.368571 -0.106308,0.404853 -0.765159,0.773916 L 41.4545,62.83158 39.259237,62.80426 c -6.030106,-0.07507 -16.19508,-0.495041 -16.870991,-0.697033 -0.359409,-0.107405 -0.523792,-0.227482 -0.741884,-0.541926 -0.250591,-0.361297 -0.28386,-0.522402 -0.315075,-1.52589 -0.06327,-2.03378 0.23288,-3.033615 1.077963,-3.639283 0.307525,-0.2204 4.818478,-2.133627 6.017853,-2.552345 0.247872,-0.08654 0.247455,-0.102501 -0.01855,-0.711959 -0.330395,-0.756986 -0.708622,-2.221756 -0.832676,-3.224748 -0.05031,-0.406952 -0.133825,-3.078805 -0.185533,-5.937448 -0.0517,-2.858644 -0.145909,-5.208974 -0.209316,-5.222958 -0.06341,-0.01399 -0.974464,-0.0493 -2.024551,-0.07845 L 23.247235,38.61921 18.831373,39.8906 C 4.9432155,43.88916 4.2929558,44.057819 3.4954426,43.86823 2.7487826,43.690732 2.2007966,42.916622 1.9565564,41.694305 z',
    vb: '0 0 64 64', w: 26, h: 26, anchor: [13, 13],
  },
  helicopter: {
    path: 'M 43.89309,0.4301 c -0.60546,-0.60546 -1.62623,-0.56506 -2.2813,0.0897 L 25.82444,16.3061 C 24.95171,-1.27473 21.64491,1.24212 21.64491,1.24212 c 0,0 -3.20153,-2.80873 -4.13518,14.07519 L 2.71103,0.51862 C 2.05636,-0.13606 1.03533,-0.17646 0.43,0.42902 c -0.60546,0.6052 -0.56506,1.6261 0.0896,2.28104 l 16.81957,16.81931 c -0.0454,1.63425 -0.072,3.41089 -0.0796,5.34281 l -0.90497,0.90496 h -1.94113 v 1.94113 L 0.51882,41.61319 c -0.6548,0.65454 -0.69533,1.67531 -0.09,2.28077 0.60533,0.60546 1.62636,0.5648 2.28104,-0.0896 L 14.41335,32.10074 v 1.94073 h 3.09928 c 0,0 1.25961,6.97312 2.03417,8.65159 0.77495,1.67913 0.032,17.17487 2.09799,17.17487 0.38346,0 0.66928,-0.53374 0.88615,-1.41331 l 6.34515,-2.71897 v -1.03314 h -5.85155 c 0.34017,-4.67077 0.24161,-10.97316 0.71942,-12.00945 0.77416,-1.67847 2.03285,-8.65159 2.03285,-8.65159 h 3.09928 v -2.974 l 12.73545,12.73689 c 0.65507,0.65442 1.67584,0.69495 2.2813,0.0896 0.60546,-0.60533 0.56479,-1.62623 -0.0901,-2.28077 L 28.876,26.68527 v -0.90813 h -0.90799 l -1.94284,-1.9431 c -0.009,-1.15407 -0.0263,-2.25524 -0.0496,-3.29693 l 17.82849,-17.826 c 0.65389,-0.65494 0.69442,-1.67702 0.0891,-2.28103 z',
    vb: '0 0 44 64', w: 26, h: 38, anchor: [13, 19],
  },
  generic: {
    path: 'm 32,1 2,1 2,3 0,18 4,1 0,-4 3,0 0,5 17,6 0,3 -15,-2 -9,0 0,12 -2,6 7,3 0,2 -8,-1 -1,2 -1,-2 -8,1 0,-2 7,-3 -2,-6 0,-12 -9,0 -15,2 0,-3 17,-6 0,-5 3,0 0,4 4,-1 0,-18 2,-3 2,-1z',
    vb: '0 0 64 64', w: 28, h: 28, anchor: [14, 12],
  },
};

// Icon size scaling by aircraft DB size class
const SIZE_SCALE = { L: 0.75, M: 1.0, H: 1.3, '': 1.0 };

// ─── Altitude colours ────────────────────────────────────────────────────────
const ALT_COLORS = [
  { max: 0,     color: '#ff5533' },   // ground / very low
  { max: 5000,  color: '#ff6633' },   // low
  { max: 18000, color: '#f0c040' },   // medium
  { max: 30000, color: '#9fda50' },   // high
  { max: Infinity, color: '#3ddc84'}, // very high
];

function altColor(altitude, isMilitary, emergency) {
  if (emergency) return '#ff2222';
  if (isMilitary) return '#38bdf8';
  if (altitude == null) return '#7a8aaa';
  for (const b of ALT_COLORS) if (altitude < b.max) return b.color;
  return '#3ddc84';
}

function fmtAlt(alt) {
  if (alt == null) return '—';
  if (alt >= 18000) return 'FL' + Math.round(alt / 100).toString().padStart(3, '0');
  return alt.toLocaleString() + ' ft';
}
function fmtSpd(spd) { return spd != null ? spd + ' kt' : '—'; }
function fmtDist(d)  { return d != null ? d + ' km' : '—'; }
function fmtVr(vr) {
  if (vr == null || Math.abs(vr) < 100) return '';
  return vr > 0 ? '▲' : '▼';
}
function fmtHdg(t) { return t != null ? t + '°' : '—'; }
function fmtAge(ts) {
  const s = Math.round(Date.now() / 1000 - ts);
  if (s < 60)  return s + 's ago';
  if (s < 3600) return Math.round(s / 60) + 'm ago';
  return Math.round(s / 3600) + 'h ago';
}

// ─── Map init ────────────────────────────────────────────────────────────────
const DEFAULT_CENTER = [46.15, 14.65];  // Slovenia
const DEFAULT_ZOOM   = 8;

const map = L.map('map', {
  center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM,
  zoomControl: true, attributionControl: false,
});

// ─── Tile layers ─────────────────────────────────────────────────────────────
const TILE_LAYERS = {
  dark:            { label: 'Dark Matter',       url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',           maxZoom: 18 },
  dark_nolabels:   { label: 'Dark No Labels',    url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',      maxZoom: 18 },
  voyager:         { label: 'Voyager',           url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', maxZoom: 19 },
  positron:        { label: 'Positron',          url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',          maxZoom: 19 },
  esri_gray_dark:  { label: 'Esri Dark Gray',    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', maxZoom: 16 },
  esri_sat:        { label: 'Esri Satellite',    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',               maxZoom: 18 },
  esri_topo:       { label: 'Esri Topo',         url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',              maxZoom: 18 },
  stadia_outdoors: { label: 'Stadia Outdoors',   url: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',          maxZoom: 20 },
  stamen_terrain:  { label: 'Stamen Terrain',    url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png',    maxZoom: 18 },
  tf_landscape:    { label: 'TF Landscape ★',    url: 'https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey={tfkey}', maxZoom: 22, needsTfKey: true },
  tf_outdoors:     { label: 'TF Outdoors ★',     url: 'https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey={tfkey}',  maxZoom: 22, needsTfKey: true },
  mt_topo:         { label: 'MT Topo ★',         url: 'https://api.maptiler.com/maps/topo-v2/{z}/{x}/{y}.png?key={mtkey}',            maxZoom: 20, needsMtKey: true },
  mt_hybrid:       { label: 'MT Satellite Hybrid ★', url: 'https://api.maptiler.com/maps/hybrid-v4-dark/{z}/{x}/{y}.jpg?key={mtkey}', maxZoom: 20, needsMtKey: true },
};

const LAYER_LS_KEY   = 'adsb_base_layer';
let baseTileLayer    = null;
let currentLayerKey  = localStorage.getItem(LAYER_LS_KEY) || 'dark';

function _resolveTileUrl(url) {
  const tfKey = localStorage.getItem('thunderforestApiKey') || '';
  const mtKey = localStorage.getItem('mapTilerApiKey') || '';
  return url.replace('{tfkey}', tfKey).replace('{mtkey}', mtKey);
}

function setBaseLayer(key, offlineId) {
  if (baseTileLayer) { map.removeLayer(baseTileLayer); baseTileLayer = null; }
  if (offlineId) {
    baseTileLayer = L.tileLayer(`http://localhost:8092/services/${offlineId}/tiles/{z}/{x}/{y}`, {
      maxZoom: 16, tileSize: 256,
    }).addTo(map);
    currentLayerKey = 'offline:' + offlineId;
  } else {
    const def = TILE_LAYERS[key] || TILE_LAYERS.dark;
    baseTileLayer = L.tileLayer(_resolveTileUrl(def.url), { maxZoom: def.maxZoom }).addTo(map);
    currentLayerKey = key;
  }
  try { localStorage.setItem(LAYER_LS_KEY, currentLayerKey); } catch(e) {}
  renderLayerPicker();
}

function initBaseTiles() {
  // If user had a saved layer, restore it immediately (skip mbtileserver probe)
  const saved = localStorage.getItem(LAYER_LS_KEY) || 'dark';
  if (saved.startsWith('offline:')) {
    const id = saved.slice(8);
    baseTileLayer = L.tileLayer(`http://localhost:8092/services/${id}/tiles/{z}/{x}/{y}`, {
      maxZoom: 16, tileSize: 256,
    }).addTo(map);
    return;
  }
  const def = TILE_LAYERS[saved] || TILE_LAYERS.dark;
  baseTileLayer = L.tileLayer(_resolveTileUrl(def.url), { maxZoom: def.maxZoom }).addTo(map);
}

function renderLayerPicker() {
  const container = el('layer-picker');
  if (!container) return;
  const tfKey = localStorage.getItem('thunderforestApiKey') || '';
  const mtKey = localStorage.getItem('mapTilerApiKey') || '';

  let html = '';
  Object.entries(TILE_LAYERS).forEach(([key, def]) => {
    if (def.needsTfKey && !tfKey) return;
    if (def.needsMtKey && !mtKey) return;
    const active = currentLayerKey === key;
    html += `<div class="layer-opt${active ? ' active' : ''}" onclick="setBaseLayer('${key}')">${def.label}</div>`;
  });
  html += `<div class="set-section" style="padding-top:6px">Offline</div>`;
  html += `<div id="offline-layers-list"><div class="layer-opt" style="pointer-events:none;opacity:0.5">Loading…</div></div>`;
  html += `<div class="set-section" style="padding-top:6px">API Keys</div>`;
  html += `<div class="set-row" style="flex-direction:column;align-items:stretch;gap:3px">
    <span style="font-size:11px;color:var(--muted)">Thunderforest</span>
    <input class="layer-key-input" type="text" value="${tfKey}" placeholder="API key" onchange="saveLayerKey('thunderforestApiKey',this.value)">
  </div>`;
  html += `<div class="set-row" style="flex-direction:column;align-items:stretch;gap:3px;padding-top:4px">
    <span style="font-size:11px;color:var(--muted)">MapTiler</span>
    <input class="layer-key-input" type="text" value="${mtKey}" placeholder="API key" onchange="saveLayerKey('mapTilerApiKey',this.value)">
  </div>`;

  container.innerHTML = html;
  loadOfflineLayers();
}

async function loadOfflineLayers() {
  const listEl = el('offline-layers-list');
  if (!listEl) return;
  try {
    const ac = new AbortController();
    const tid = setTimeout(() => ac.abort(), 2000);
    const services = await (await fetch('http://localhost:8092/services', { signal: ac.signal })).json();
    clearTimeout(tid);
    if (!services.length) {
      listEl.innerHTML = '<div class="layer-opt" style="pointer-events:none;opacity:0.5">No offline maps</div>';
      return;
    }
    listEl.innerHTML = services.map(s => {
      const id = s.url.split('/').pop();
      const active = currentLayerKey === 'offline:' + id;
      return `<div class="layer-opt${active ? ' active' : ''}" onclick="setBaseLayer(null,'${id}')">${s.name || id}</div>`;
    }).join('');
  } catch(e) {
    listEl.innerHTML = '<div class="layer-opt" style="pointer-events:none;opacity:0.5">mbtileserver offline</div>';
  }
}

function saveLayerKey(lsKey, val) {
  try { localStorage.setItem(lsKey, val.trim()); } catch(e) {}
}

initBaseTiles();

// ─── State ───────────────────────────────────────────────────────────────────
let aircraftData  = {};   // hex → api aircraft object
let historyData   = {};
let markers       = {};   // hex → L.marker
let trails        = {};   // hex → L.polyline
let rangeRings    = [];
let selectedHex   = null;
let followHex     = null;
let showTrails    = true;
let showRings     = true;
let currentTab    = 'active';
let receiverPos   = null;

// Cancel follow on manual map drag
map.on('dragstart', () => { if (followHex) { followHex = null; updateFollowBtn(); } });

// ─── Icons ───────────────────────────────────────────────────────────────────
function makeIcon(ac) {
  const def   = ICON_DEFS[ac.icon_type] || ICON_DEFS.generic;
  const scale = SIZE_SCALE[ac.size] || 1.0;
  const w     = Math.round(def.w * scale);
  const h     = Math.round(def.h * scale);
  const color = altColor(ac.altitude, ac.is_military, ac.emergency);
  const track = ac.track ?? 0;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${def.vb}" width="${w}" height="${h}">
    <path d="${def.path}" fill="${color}" stroke="rgba(0,0,0,0.55)" stroke-width="1.5"/>
  </svg>`;

  const cls = ac.emergency ? 'emerg-icon' : '';
  return L.divIcon({
    className: 'aircraft-div-icon',
    html: `<div class="${cls}" style="width:${w}px;height:${h}px;transform:rotate(${track}deg);transform-origin:center">${svg}</div>`,
    iconSize:   [w, h],
    iconAnchor: [Math.round(def.anchor[0] * scale), Math.round(def.anchor[1] * scale)],
  });
}

// Small list icon (always upright, 18×18)
function makeListIcon(ac) {
  const def   = ICON_DEFS[ac.icon_type] || ICON_DEFS.generic;
  const color = altColor(ac.altitude, ac.is_military, ac.emergency);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${def.vb}" width="18" height="18">
    <path d="${def.path}" fill="${color}" stroke="rgba(0,0,0,0.4)" stroke-width="2"/>
  </svg>`;
}

// ─── Markers ─────────────────────────────────────────────────────────────────
function updateMarker(ac) {
  if (ac.lat == null || ac.lon == null) {
    if (markers[ac.hex]) { map.removeLayer(markers[ac.hex]); delete markers[ac.hex]; }
    return;
  }

  const latlng = [ac.lat, ac.lon];
  if (markers[ac.hex]) {
    markers[ac.hex].setLatLng(latlng).setIcon(makeIcon(ac));
  } else {
    markers[ac.hex] = L.marker(latlng, { icon: makeIcon(ac) })
      .on('click', () => selectAircraft(ac.hex))
      .addTo(map);
  }
}

function removeMarker(hex) {
  if (markers[hex]) { map.removeLayer(markers[hex]); delete markers[hex]; }
}

// ─── Trails ──────────────────────────────────────────────────────────────────
function updateTrail(ac) {
  if (!showTrails) return;
  const pts = ac.track_points;
  if (!pts || pts.length < 2) return;

  const latlngs = pts.map(p => [p[0], p[1]]);
  const color   = altColor(ac.altitude, ac.is_military, false);
  const gone    = ac.gone;

  if (trails[ac.hex]) {
    trails[ac.hex].setLatLngs(latlngs)
      .setStyle({ color: gone ? '#445' : color, dashArray: gone ? '4 6' : null, opacity: gone ? 0.4 : 0.65 });
  } else {
    trails[ac.hex] = L.polyline(latlngs, {
      color:     gone ? '#445' : color,
      weight:    1.8,
      opacity:   gone ? 0.4 : 0.65,
      dashArray: gone ? '4 6' : null,
    }).addTo(map);
  }
}

function removeTrail(hex) {
  if (trails[hex]) { map.removeLayer(trails[hex]); delete trails[hex]; }
}

function toggleTrails() {
  showTrails = document.getElementById('trails-toggle').checked;
  if (!showTrails) {
    Object.keys(trails).forEach(removeTrail);
  } else {
    Object.values(aircraftData).forEach(updateTrail);
    Object.values(historyData).forEach(updateTrail);
  }
}

// ─── Range rings ─────────────────────────────────────────────────────────────
const RING_ALL     = [25, 50, 75, 100, 150, 200, 250, 300, 400];
const RING_DEFAULT = [50, 100, 200, 300];
const RING_LS_KEY  = 'adsb_rings';

function getRingKm() {
  try {
    const saved = JSON.parse(localStorage.getItem(RING_LS_KEY));
    if (Array.isArray(saved) && saved.length > 0) return saved;
  } catch(e) {}
  return RING_DEFAULT.slice();
}

function toggleRingKm(km) {
  const current = getRingKm();
  const idx = current.indexOf(km);
  const next = idx >= 0
    ? current.filter(k => k !== km)
    : [...current, km].sort((a, b) => a - b);
  try { localStorage.setItem(RING_LS_KEY, JSON.stringify(next)); } catch(e) {}
  renderRingOpts();
  drawRings();
}

function renderRingOpts() {
  const container = document.getElementById('rings-opts');
  if (!container) return;
  const active = getRingKm();
  container.innerHTML = RING_ALL.map(km =>
    `<button class="ring-chip${active.includes(km) ? ' active' : ''}" onclick="toggleRingKm(${km})">${km}km</button>`
  ).join('');
}

function drawRings() {
  rangeRings.forEach(r => map.removeLayer(r));
  rangeRings = [];
  if (!showRings || !receiverPos) return;
  getRingKm().forEach(km => {
    const r = L.circle([receiverPos.lat, receiverPos.lon], {
      radius:    km * 1000,
      color:     '#2a3550',
      weight:    1,
      fill:      false,
      dashArray: '3 9',
    }).addTo(map);
    rangeRings.push(r);
  });
}

function toggleRings() {
  const cb = document.getElementById('rings-toggle');
  showRings = cb ? cb.checked : !showRings;
  if (cb && !showRings) cb.checked = false;
  if (cb && showRings)  cb.checked = true;
  document.getElementById('rings-btn').classList.toggle('active', showRings);
  drawRings();
}

// ─── Receiver marker ─────────────────────────────────────────────────────────
let receiverMarker = null;

function updateReceiverMarker(pos) {
  if (!pos || !pos.lat) return;
  const ll = [pos.lat, pos.lon];
  if (receiverMarker) { receiverMarker.setLatLng(ll); return; }
  receiverMarker = L.circleMarker(ll, {
    radius: 5, color: '#e8b04f', fillColor: '#e8b04f', fillOpacity: 1, weight: 2,
  }).bindTooltip('CD receiver', { permanent: false }).addTo(map);
}

// ─── Selection (inline expanded row) ─────────────────────────────────────────
function selectAircraft(hex) {
  if (selectedHex === hex) {
    selectedHex = null; followHex = null;
    renderList(); return;
  }
  selectedHex = hex; followHex = null;
  renderList();
  const row = el('row-' + hex);
  if (row) row.scrollIntoView({ block: 'nearest' });
}

function buildExpanded(ac) {
  const followActive = followHex === ac.hex;
  const rows = [
    ['Altitude',   fmtAlt(ac.altitude)],
    ['Speed',      fmtSpd(ac.speed)],
    ['Heading',    fmtHdg(ac.track)],
    ['Vert rate',  ac.vert_rate != null ? ac.vert_rate + ' ft/m ' + fmtVr(ac.vert_rate) : '—'],
    ['Distance',   fmtDist(ac.distance)],
    ['Squawk',     ac.squawk || '—'],
    ['RSSI',       ac.rssi != null ? ac.rssi.toFixed(1) + ' dBFS' : '—'],
    ['Messages',   ac.messages ?? '—'],
    ['First seen', ac.first_seen ? fmtAge(ac.first_seen) : '—'],
    ['Last seen',  ac.last_seen  ? fmtAge(ac.last_seen)  : '—'],
  ];
  const typeStr  = ac.type_name || (ac.type_code ? 'Type: ' + ac.type_code : '');
  const emgHtml  = ac.emergency ? `<div class="exp-emergency">⚠ EMERGENCY SQUAWK</div>` : '';
  const emgCls   = ac.emergency ? ' emergency' : '';
  return `<div class="ac-expanded${emgCls}">
    ${typeStr ? `<div class="exp-type">${typeStr}</div>` : ''}
    <div class="exp-grid">${rows.map(([l, v]) =>
      `<div class="exp-cell"><div class="exp-label">${l}</div><div class="exp-value">${v}</div></div>`
    ).join('')}</div>
    <div class="exp-btns">
      <button class="exp-btn" onclick="centerOnSelected()">⊕ Center</button>
      <button class="exp-btn${followActive ? ' active' : ''}" id="follow-btn" onclick="toggleFollow()">${followActive ? '⏸ Following' : '▶ Follow'}</button>
    </div>
    ${emgHtml}
  </div>`;
}

function centerOnSelected() {
  const ac = aircraftData[selectedHex] || historyData[selectedHex];
  if (ac && ac.lat != null) map.setView([ac.lat, ac.lon], Math.max(map.getZoom(), 10));
}

function toggleFollow() {
  followHex = followHex === selectedHex ? null : selectedHex;
  if (followHex) centerOnSelected();
  const btn = el('follow-btn');
  if (btn) {
    btn.classList.toggle('active', !!followHex);
    btn.textContent = followHex ? '⏸ Following' : '▶ Follow';
  }
}

function updateFollowBtn() {
  const btn = el('follow-btn');
  if (!btn) return;
  const active = !!(followHex && followHex === selectedHex);
  btn.classList.toggle('active', active);
  btn.textContent = active ? '⏸ Following' : '▶ Follow';
}

// ─── Right panel ─────────────────────────────────────────────────────────────
function switchTab(tab) {
  currentTab = tab;
  el('tab-active').classList.toggle('active', tab === 'active');
  el('tab-history').classList.toggle('active', tab === 'history');
  renderList();
}

function renderList() {
  const list = el('ac-list');
  const prevScroll = list.scrollTop;
  const data = currentTab === 'active'
    ? Object.values(aircraftData)
    : Object.values(historyData);

  el('badge-active').textContent  = Object.keys(aircraftData).length;
  el('badge-history').textContent = Object.keys(historyData).length;

  if (!data.length) {
    list.innerHTML = `<div class="list-empty">${currentTab === 'active' ? 'No aircraft detected' : 'No history this session'}</div>`;
    return;
  }

  const sorted = data.slice().sort((a, b) => {
    if (currentTab === 'history') return (b.gone_at || 0) - (a.gone_at || 0);
    return (a.distance ?? 99999) - (b.distance ?? 99999);
  });

  list.innerHTML = sorted.map(ac => {
    const label  = ac.flight || ac.registration || ac.hex.toUpperCase();
    const sub    = [ac.type_name || ac.type_code, ac.registration && ac.flight ? ac.registration : ''].filter(Boolean).join(' · ');
    const color  = altColor(ac.altitude, ac.is_military, ac.emergency);
    const vr     = fmtVr(ac.vert_rate);
    const vrColor  = ac.vert_rate > 100 ? '#3ddc84' : ac.vert_rate < -100 ? '#ff8080' : 'var(--muted)';
    const milBadge = ac.is_military ? '<span class="mil-badge">MIL</span>' : '';
    const emgBadge = ac.emergency   ? '<span class="emg-badge">EMRG</span>' : '';
    const sel    = selectedHex === ac.hex ? ' selected' : '';
    const gone   = ac.gone ? ' gone' : '';
    const emgCls = ac.emergency ? ' emergency' : '';

    const row = `<div class="ac-row${sel}${gone}${emgCls}" id="row-${ac.hex}" onclick="selectAircraft('${ac.hex}')">
      <div class="ac-icon-wrap">${makeListIcon(ac)}</div>
      <div class="ac-info">
        <div class="ac-callsign">${label}${milBadge}${emgBadge}</div>
        <div class="ac-sub">${sub || '—'}</div>
      </div>
      <div class="ac-right">
        <div class="ac-alt" style="color:${color}">${fmtAlt(ac.altitude)}</div>
        <div class="ac-dist">${fmtDist(ac.distance)} <span class="ac-vr" style="color:${vrColor}">${vr}</span></div>
      </div>
    </div>`;

    return row + (selectedHex === ac.hex ? buildExpanded(ac) : '');
  }).join('');

  list.scrollTop = prevScroll;
}

// ─── Main update loop ─────────────────────────────────────────────────────────
async function poll() {
  try {
    const resp = await fetch('/api/aircraft');
    const d    = await resp.json();

    // Receiver
    if (d.receiver && d.receiver.lat) {
      receiverPos = d.receiver;
      updateReceiverMarker(receiverPos);
      if (!rangeRings.length && showRings) drawRings();
    }

    // Status bar
    el('d1090-dot').className = 'status-dot ' + (d.dump1090_running ? 'on' : 'off');
    const startBtn = el('d1090-start-btn');
    if (startBtn) {
      startBtn.classList.toggle('active', d.dump1090_running);
      startBtn.textContent = d.dump1090_running ? 'Running' : 'Start';
    }
    el('stat-count').textContent = `${d.stats.active_count} aircraft`;
    if (d.stats.farthest) {
      const f = d.stats.farthest;
      el('stat-farthest').textContent = `farthest: ${f.flight} ${f.distance} km`;
    } else {
      el('stat-farthest').textContent = '';
    }

    // Active aircraft
    const newActive = {};
    d.active.forEach(ac => { newActive[ac.hex] = ac; });

    // Remove markers for aircraft no longer in active
    Object.keys(aircraftData).forEach(hex => {
      if (!newActive[hex]) removeMarker(hex);
    });

    aircraftData = newActive;
    Object.values(aircraftData).forEach(ac => {
      updateMarker(ac);
      updateTrail(ac);
    });

    // History
    const newHistory = {};
    d.history.forEach(ac => { newHistory[ac.hex] = ac; });
    // Trails for newly gone aircraft
    Object.keys(newHistory).forEach(hex => {
      if (!historyData[hex]) updateTrail(newHistory[hex]);
    });
    historyData = newHistory;

    // Follow
    if (followHex) {
      const ac = aircraftData[followHex];
      if (ac && ac.lat != null) map.panTo([ac.lat, ac.lon], { animate: true, duration: 0.8 });
    }

    // Deselect if selected aircraft is gone from both dicts
    if (selectedHex && !aircraftData[selectedHex] && !historyData[selectedHex]) {
      selectedHex = null; followHex = null;
    }

    renderList();
  } catch (e) {
    // silent — connection issue or dump1090 not running
  }
  setTimeout(poll, 2000);
}

// ─── Settings ────────────────────────────────────────────────────────────────
function toggleSettings() {
  el('settings').classList.toggle('hidden');
  if (!el('settings').classList.contains('hidden')) {
    loadDbStatus();
    loadVersion();
    renderRingOpts();
    renderLayerPicker();
  }
}

async function loadVersion() {
  try {
    const d = await (await fetch('/api/version')).json();
    const verEl = el('app-version');
    if (verEl) verEl.textContent = `v${d.version} · ${d.commit}`;
  } catch(e) {}
}

async function checkUpdate() {
  const btn = el('check-update-btn');
  const msg = el('update-msg');
  btn.disabled = true; btn.textContent = 'Checking…';
  if (msg) { msg.textContent = ''; }
  try {
    const d = await (await fetch('/api/system/check-update', { method: 'POST' })).json();
    if (d.ok) {
      const txt = d.behind === 0 ? 'Up to date' : `${d.behind} update${d.behind > 1 ? 's' : ''} available`;
      if (msg) { msg.textContent = txt; msg.style.color = d.behind === 0 ? 'var(--green)' : 'var(--accent)'; }
    } else {
      if (msg) { msg.textContent = 'Check failed'; msg.style.color = 'var(--red)'; }
    }
  } catch(e) {
    if (msg) { msg.textContent = 'Network error'; msg.style.color = 'var(--red)'; }
  }
  btn.disabled = false; btn.textContent = 'Check';
}

async function loadDbStatus() {
  try {
    const d = await (await fetch('/api/db/status')).json();
    el('db-version-label').textContent = d.version
      ? `DB: ${d.version} (${(d.aircraft_count/1000).toFixed(0)}k ac)`
      : 'DB: not loaded';
  } catch(e) {
    el('db-version-label').textContent = 'DB: error';
  }
}

async function updateDb() {
  const btn = el('db-update-btn');
  const msg = el('db-status-msg');
  btn.disabled = true; btn.textContent = 'Downloading…';
  msg.textContent = '';
  try {
    const d = await (await fetch('/api/db/update', { method: 'POST' })).json();
    if (d.ok) {
      msg.textContent = `Updated: ${d.version} (${(d.aircraft_count/1000).toFixed(0)}k aircraft)`;
      msg.style.color = '#3ddc84';
      await loadDbStatus();
    } else {
      msg.textContent = 'Error: ' + d.error;
      msg.style.color = 'var(--red)';
    }
  } catch(e) {
    msg.textContent = 'Network error';
    msg.style.color = 'var(--red)';
  }
  btn.disabled = false; btn.textContent = 'Update';
}

async function d1090Action(action) {
  try {
    await fetch(`/api/dump1090/${action}`, { method: 'POST' });
  } catch(e) {}
}

async function updateApp() {
  try {
    await fetch('/api/system/update', { method: 'POST' });
  } catch(e) {}
}

function _showSplash(msg) {
  const d = document.createElement('div');
  d.style.cssText = 'position:fixed;inset:0;background:#000;z-index:9999;display:flex;align-items:center;justify-content:center;font-size:1rem;color:#555;letter-spacing:0.05em;font-family:system-ui,sans-serif';
  d.textContent = msg;
  document.body.appendChild(d);
}

async function appRestart() {
  _showSplash('ADS-B restarting…');
  try { await fetch('/api/system/restart', { method: 'POST' }); } catch(e) {}
  setTimeout(() => location.reload(), 4000);
}

async function appShutdown() {
  if (!confirm('Stop ADS-B app? Start it back from the Dashboard.')) return;
  _showSplash('ADS-B offline. Start it back up from the Dashboard.');
  try { await fetch('/api/system/shutdown', { method: 'POST' }); } catch(e) {}
}

function setAccent(hex) {
  document.documentElement.style.setProperty('--accent', hex);
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  document.documentElement.style.setProperty('--accent-dim',    `rgba(${r},${g},${b},0.18)`);
  document.documentElement.style.setProperty('--accent-border', `rgba(${r},${g},${b},0.35)`);
  localStorage.setItem('adsb_accent', hex);
}

// ─── Utils ───────────────────────────────────────────────────────────────────
function el(id) { return document.getElementById(id); }

// ─── Boot ────────────────────────────────────────────────────────────────────
(function init() {
  const saved = localStorage.getItem('adsb_accent');
  if (saved) {
    setAccent(saved);
    const inp = el('accent-input');
    if (inp) inp.value = saved;
  }

  // Rings toggle state
  el('rings-btn').classList.toggle('active', showRings);

  poll();
})();
