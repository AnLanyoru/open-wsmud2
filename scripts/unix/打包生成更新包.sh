#!/bin/bash
# ==============================================
#   打包更新资源包 (macOS / Linux)
#   编译 → 部署 → 打包 → release.tar (不含 node_modules)
#
#   用法:
#     bash 打包生成更新包.sh              # 普通编译
#     bash 打包生成更新包.sh --binary     # 启用二进制协议 (send_room → send_room_b)
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUTPUT_DIR="$SCRIPT_DIR"
PACKAGE_NAME="release.tar"

# 解析 --binary 标志
for arg in "$@"; do
    case "$arg" in
        --binary) BUILD_FLAGS="--binary" ;;
        --metrics) BUILD_FLAGS="$BUILD_FLAGS --metrics" ;;
        -h|--help)
            echo "用法: bash 打包生成更新包.sh [--binary] [--metrics]"
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
echo "  打包更新资源包"
echo "  目标平台: $(uname -s)"
echo "  输出: $PACKAGE_NAME (不含 node_modules)"
[ -n "$BUILD_FLAGS" ] && echo "  构建标志: $BUILD_FLAGS"
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
