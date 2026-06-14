#!/bin/bash
# ==============================================
#   open-wsmud2 启动脚本 (Linux)
#   仅用于首次部署后的日常重启维护
#   首次部署请使用 首次部署/linux/ 下的脚本
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo "============================================"
echo "  open-wsmud2 启动 (Linux)"
echo "============================================"
echo ""

cd "$PROJECT_ROOT"

# 启动 Web 服务器 (后台)
echo "启动 Web 服务器 (http://localhost:8088)..."
node web.js &
WEB_PID=$!

# 启动游戏服务器 (前台)
echo "启动游戏服务器..."
node main.mjs

# 清理
kill $WEB_PID 2>/dev/null
echo "服务已停止。"
