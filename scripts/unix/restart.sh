#!/bin/bash
# ==============================================
#   open-wsmud2 重启脚本 (macOS / Linux)
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 自动定位部署目录
if [ -f "$SCRIPT_DIR/../../web.js" ]; then
    DEPLOY_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
else
    DEPLOY_DIR="$SCRIPT_DIR"
fi

if [ -f "$SCRIPT_DIR/../lib/common.sh" ]; then
    source "$SCRIPT_DIR/../lib/common.sh"
elif [ -f "$DEPLOY_DIR/scripts/lib/common.sh" ]; then
    source "$DEPLOY_DIR/scripts/lib/common.sh"
fi

echo "============================================"
echo "  重启 open-wsmud2 服务"
echo "  部署目录: $DEPLOY_DIR"
echo "============================================"
echo ""

restart_services "$DEPLOY_DIR"
