#!/bin/bash
# ==============================================
#   放置在部署包同目录 — 自动部署 (Linux)
#   解压 fast_start.tar 并启动服务
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PACKAGE_NAME="fast_start.tar"

echo "============================================"
echo "  自动部署 open-wsmud2 (Linux)"
echo "============================================"
echo ""

# --- 检查部署包是否存在 ---
if [ ! -f "$SCRIPT_DIR/$PACKAGE_NAME" ]; then
    echo "✗ 错误: 未找到 $PACKAGE_NAME"
    echo "  请确保本脚本与 $PACKAGE_NAME 在同一目录下。"
    exit 1
fi

# --- 解压 ---
echo "[1/3] 解压 $PACKAGE_NAME ..."
cd "$SCRIPT_DIR"
tar -xf "$PACKAGE_NAME"
echo "  解压完成。"
echo ""

# --- 安装依赖 (安全冗余) ---
echo "[2/3] 检查依赖..."
if [ -f "package.json" ]; then
    npm install --production 2>/dev/null || npm install
fi
echo ""

# --- 启动服务 ---
echo "[3/3] 启动服务..."
echo ""

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
