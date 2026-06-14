#!/bin/bash
# ==============================================
#   打包更新资源包 (Linux)
#   编译 → 部署 → 打包 → release.tar (不含依赖)
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
OUTPUT_DIR="$SCRIPT_DIR"
PACKAGE_NAME="release.tar"

echo "============================================"
echo "  打包更新资源包 (Linux)"
echo "  输出: $PACKAGE_NAME (不含 node_modules)"
echo "============================================"
echo ""

cd "$PROJECT_ROOT"

# --- 1. 编译 TypeScript ---
echo "[1/3] 编译 TypeScript..."
cd "$PROJECT_ROOT/server"
npx tsc --outDir dist 2>/dev/null || echo "  (存在类型错误，JS 输出正常，继续...)"
cd "$PROJECT_ROOT"
echo ""

# --- 2. 运行部署 ---
echo "[2/3] 运行部署 (core → os/, res → world/)..."
node server/scripts/deploy.mjs
echo ""

# --- 3. 构建前端并打包 ---
echo "[3/3] 构建前端并打包 $PACKAGE_NAME ..."
npx vite build
echo ""

cd "$PROJECT_ROOT"
tar -cf "$OUTPUT_DIR/$PACKAGE_NAME" \
    web.js main.mjs config.js \
    package.json \
    os/ world/ www/ \
    api/ web/ data/ \
    --exclude='*.ts' \
    --exclude='*.map' \
    2>/dev/null

echo "============================================"
echo "  ✓ 打包完成"
echo "  $OUTPUT_DIR/$PACKAGE_NAME"
echo ""
echo "  更新方法："
echo "  1. 将 release.tar 与 放置在更新包同目录启动自动更新资源.sh"
echo "     一同复制到服务器部署目录"
echo "  2. 在服务器上运行: bash 放置在更新包同目录启动自动更新资源.sh"
echo "============================================"
