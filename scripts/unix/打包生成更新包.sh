#!/bin/bash
# ==============================================
#   打包更新资源包 (macOS / Linux)
#   编译 → 部署 → 打包 → release.tar (不含 node_modules)
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUTPUT_DIR="$SCRIPT_DIR"
PACKAGE_NAME="release.tar"

# 加载共享函数库
source "$SCRIPT_DIR/../lib/common.sh"

echo "============================================"
echo "  打包更新资源包"
echo "  目标平台: $(uname -s)"
echo "  输出: $PACKAGE_NAME (不含 node_modules)"
echo "============================================"
echo ""

check_node

# 1. 轻量构建 (跳过 npm install)
build_light "$PROJECT_ROOT"

# 2. 打包 (不含 node_modules)
echo "[打包]"
pack_release "$PROJECT_ROOT" "$OUTPUT_DIR/$PACKAGE_NAME"

echo ""
echo "============================================"
echo "  ✓ 打包完成"
echo "  $OUTPUT_DIR/$PACKAGE_NAME"
echo ""
echo "  更新方法："
echo "  1. 将 release.tar 与 unix/自动更新.sh"
echo "     一同复制到服务器部署目录"
echo "  2. 在服务器上运行: bash 自动更新.sh"
echo "============================================"
