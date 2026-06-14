#!/bin/bash
# ==============================================
#   放置在更新包同目录 — 自动更新资源 (macOS)
#   解压 release.tar 覆盖到当前目录
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PACKAGE_NAME="release.tar"

echo "============================================"
echo "  自动更新资源 open-wsmud2 (macOS)"
echo "============================================"
echo ""

# --- 检查更新包是否存在 ---
if [ ! -f "$SCRIPT_DIR/$PACKAGE_NAME" ]; then
    echo "✗ 错误: 未找到 $PACKAGE_NAME"
    echo "  请确保本脚本与 $PACKAGE_NAME 在同一目录下。"
    exit 1
fi

# --- 解压覆盖 ---
echo "[1/2] 解压 $PACKAGE_NAME (覆盖现有文件)..."
cd "$SCRIPT_DIR"
tar -xf "$PACKAGE_NAME"
echo "  更新完成。"
echo ""

# --- 重启服务 ---
echo "[2/2] 重启服务..."
echo ""

# 尝试停止旧进程
echo "停止旧服务..."
pkill -f "node web.js" 2>/dev/null || true
pkill -f "node main.mjs" 2>/dev/null || true
sleep 1

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
