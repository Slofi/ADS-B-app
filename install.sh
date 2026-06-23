#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== ADS-B App install ==="

# Venv
if [ ! -d "$HOME/.adsb-venv" ]; then
  python3 -m venv "$HOME/.adsb-venv"
fi
"$HOME/.adsb-venv/bin/pip" install -q -r "$DIR/requirements.txt"

# Leaflet (local copy — served from static/lib/ for offline use)
mkdir -p "$DIR/static/lib"
for f in leaflet.css leaflet.js; do
  if [ ! -f "$DIR/static/lib/$f" ]; then
    echo "Downloading Leaflet $f..."
    curl -sL "https://unpkg.com/leaflet@1.9.4/dist/$f" -o "$DIR/static/lib/$f"
  fi
done

# Systemd user service
SERVICE_FILE="$HOME/.config/systemd/user/adsb-app.service"
mkdir -p "$HOME/.config/systemd/user"
cat > "$SERVICE_FILE" << EOF
[Unit]
Description=ADS-B App
After=network.target

[Service]
Type=simple
WorkingDirectory=$DIR
ExecStart=$HOME/.adsb-venv/bin/python3 $DIR/app.py
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
# not enabled at boot — started on demand via Dashboard
systemctl --user start adsb-app
echo "=== Done — http://localhost:5400 ==="
