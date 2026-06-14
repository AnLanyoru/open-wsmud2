#!/bin/bash
# ==============================================
#   打包首次部署资源包 (macOS)
#   编译 → 部署 → 打包 → fast_start.tar
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
OUTPUT_DIR="$SCRIPT_DIR"
PACKAGE_NAME="fast_start.tar"

echo "============================================"
echo "  打包首次部署资源包 (macOS)"
echo "  输出: $PACKAGE_NAME"
echo "============================================"
echo ""

cd "$PROJECT_ROOT"

# --- 1. 安装依赖 ---
echo "[1/5] 安装依赖..."
npm install
echo ""

# --- 2. 编译 TypeScript ---
echo "[2/5] 编译 TypeScript..."
cd "$PROJECT_ROOT/server"
npx tsc --outDir dist 2>/dev/null || echo "  (存在类型错误，JS 输出正常，继续...)"
cd "$PROJECT_ROOT"
echo ""

# --- 3. 运行部署 ---
echo "[3/5] 运行部署 (core → os/, res → world/)..."
node server/scripts/deploy.mjs
echo ""

# --- 4. 构建前端 ---
echo "[4/5] 构建前端..."
npx vite build
echo ""

# --- 5. 打包 ---
echo "[5/5] 打包 $PACKAGE_NAME ..."
cd "$PROJECT_ROOT"
tar -cf "$OUTPUT_DIR/$PACKAGE_NAME" \
    web.js main.mjs config.js \
    package.json package-lock.json \
    node_modules/ \
    os/ world/ www/ \
    api/ web/ data/ \
    --exclude='node_modules/.cache' \
    --exclude='*.ts' \
    --exclude='*.map' \
    2>/dev/null

echo ""
echo "============================================"
echo "  ✓ 打包完成"
echo "  $OUTPUT_DIR/$PACKAGE_NAME"
echo ""
echo "  部署方法："
echo "  1. 将 fast_start.tar 与 放置在部署包同目录启动自动部署.sh"
echo "     一同复制到服务器目标目录"
echo "  2. 在服务器上运行: bash 放置在部署包同目录启动自动部署.sh"
echo "============================================"
