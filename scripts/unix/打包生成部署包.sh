#!/bin/bash
# ==============================================
#   打包首次部署资源包 (macOS / Linux)
#   编译 → 部署 → 打包 → fast_start.tar
#
#   用法:
#     bash 打包生成部署包.sh              # 普通编译
#     bash 打包生成部署包.sh --binary     # 启用二进制协议 (send_room → send_room_b)
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUTPUT_DIR="$SCRIPT_DIR"
PACKAGE_NAME="fast_start.tar"

# 解析 --binary 标志
for arg in "$@"; do
    case "$arg" in
        --binary) BUILD_FLAGS="--binary" ;;
        --metrics) BUILD_FLAGS="$BUILD_FLAGS --metrics" ;;
        -h|--help)
            echo "用法: bash 打包生成部署包.sh [--binary] [--metrics]"
            echo "  --binary   启用二进制协议转换"
            echo "  --metrics  注入性能监控埋点 (调试用)"
            exit 0
            ;;
    esac
done
export BUILD_FLAGS

# 加载共享函数库
source "$SCRIPT_DIR/../lib/common.sh"

echo "============================================"
echo "  打包首次部署资源包"
echo "  目标平台: $(uname -s)"
echo "  输出: $PACKAGE_NAME"
[ -n "$BUILD_FLAGS" ] && echo "  构建标志: $BUILD_FLAGS"
echo "============================================"
echo ""

check_node
check_npm

# 1. 完整构建 (npm install + pack.mjs + vite build)
build_full "$PROJECT_ROOT"

# 2. 打包 (不含 node_modules — 原生模块由目标机器编译)
echo "[打包]"
pack_release "$PROJECT_ROOT" "$OUTPUT_DIR/$PACKAGE_NAME"

echo ""
echo "============================================"
echo "  ✓ 打包完成"
echo "  $OUTPUT_DIR/$PACKAGE_NAME"
echo "  大小: $(du -sh "$OUTPUT_DIR/$PACKAGE_NAME" | cut -f1)"
echo ""
echo "  注意: 不含 node_modules/ (better-sqlite3 是原生模块)"
echo "  目标服务器需具备 Node.js 24+ 及编译工具 (gcc/make)"
echo ""
echo "  部署方法："
echo "  1. 将 fast_start.tar 与 unix/自动部署.sh"
echo "     一同复制到服务器目标目录"
echo "  2. 在服务器上运行: bash 自动部署.sh"
echo "============================================"
