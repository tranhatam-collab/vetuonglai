#!/bin/bash
# arm.sh — kích hoạt auto-dev-loop
# Cách dùng: bash .autodev/arm.sh [--load]
#   --load  cũng chạy launchctl load luôn

set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .autodev/state.json ]; then
  echo "ERROR: .autodev/state.json không tồn tại"
  exit 1
fi

# Reset state: xoá stopped_at, stopped_reason, stop_requested
node -e "
const fs = require('fs');
const s = JSON.parse(fs.readFileSync('.autodev/state.json', 'utf8'));
s.stopped_at = null;
s.stopped_reason = null;
s.stop_requested = false;
s.consecutive_clean_ticks = 0;
fs.writeFileSync('.autodev/state.json', JSON.stringify(s, null, 2) + '\n');
console.log('[arm] state reset, stopped_at=null, consecutive_clean_ticks=0');
"

# Xoá file STOP nếu có
rm -f .autodev/STOP

# Commit reset state
if ! git diff --quiet .autodev/state.json; then
  git add .autodev/state.json
  git commit -m "[auto-dev-loop] arm — reset state cho phiên chạy mới"
  echo "[arm] đã commit state reset"
fi

PLIST="$HOME/Library/LaunchAgents/com.vetuonglai.autodev.plist"

if [ "${1:-}" = "--load" ]; then
  if [ ! -f "$PLIST" ]; then
    echo "[arm] Plist chưa cài. Copy từ repo..."
    cp .autodev/com.vetuonglai.autodev.plist "$PLIST"
  fi
  launchctl unload "$PLIST" 2>/dev/null || true
  launchctl load "$PLIST"
  echo "[arm] launchd loaded. Tick đầu tiên sau ~9 phút."
  echo "[arm] Theo dõi: tail -f .autodev/logs/launchd.stdout.log"
  echo "[arm] Dừng: bash .autodev/stop.sh"
else
  echo "[arm] State đã reset. Để load launchd:"
  echo "      cp .autodev/com.vetuonglai.autodev.plist ~/Library/LaunchAgents/"
  echo "      launchctl load ~/Library/LaunchAgents/com.vetuonglai.autodev.plist"
  echo "[arm] Hoặc chạy lại: bash .autodev/arm.sh --load"
fi
