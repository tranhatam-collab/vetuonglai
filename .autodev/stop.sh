#!/bin/bash
# Tạo file STOP để loop tự exit ở tick kế tiếp, và unload launchd ngay.
set -euo pipefail
cd "$(dirname "$0")/.."
touch .autodev/STOP
launchctl unload "$HOME/Library/LaunchAgents/com.vetuonglai.autodev.plist" 2>/dev/null || true
echo "[auto-dev-loop] STOP requested. File .autodev/STOP đã tạo. launchd đã unload."
echo "Để tiếp tục lại: rm .autodev/STOP && launchctl load ~/Library/LaunchAgents/com.vetuonglai.autodev.plist"
