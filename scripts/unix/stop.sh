#!/bin/bash
# ==============================================
#   open-wsmud2 停止脚本 (macOS / Linux)
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -f "$SCRIPT_DIR/../lib/common.sh" ]; then
    source "$SCRIPT_DIR/../lib/common.sh"
elif [ -f "$(cd "$SCRIPT_DIR/../.." && pwd)/scripts/lib/common.sh" ]; then
    source "$(cd "$SCRIPT_DIR/../.." && pwd)/scripts/lib/common.sh"
fi

echo "============================================"
echo "  停止 open-wsmud2 服务"
echo "============================================"
echo ""

stop_services
log_info "所有服务已停止。"
