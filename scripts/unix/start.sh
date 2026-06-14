#!/bin/bash
# ==============================================
#   open-wsmud2 启动脚本 (macOS / Linux)
#   从部署目录启动 Web + 游戏服务器
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 如果在 scripts/unix/ 下运行，自动定位到项目根目录
if [ -f "$SCRIPT_DIR/../../web.js" ]; then
    DEPLOY_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
else
    DEPLOY_DIR="$SCRIPT_DIR"
fi

# 加载共享函数库 (可能在 scripts/lib/ 或 DEPLOY_DIR/scripts/lib/)
if [ -f "$SCRIPT_DIR/../lib/common.sh" ]; then
    source "$SCRIPT_DIR/../lib/common.sh"
elif [ -f "$DEPLOY_DIR/scripts/lib/common.sh" ]; then
    source "$DEPLOY_DIR/scripts/lib/common.sh"
fi

echo "============================================"
echo "  open-wsmud2 启动"
echo "  部署目录: $DEPLOY_DIR"
echo "============================================"
echo ""

if ! command -v node &>/dev/null; then
    echo "错误: 未找到 Node.js"
    exit 1
fi

if [ ! -f "$DEPLOY_DIR/web.js" ] || [ ! -f "$DEPLOY_DIR/main.mjs" ]; then
    echo "错误: 未找到 web.js / main.mjs"
    echo "  请确保在部署目录下运行此脚本"
    exit 1
fi

start_services "$DEPLOY_DIR"
