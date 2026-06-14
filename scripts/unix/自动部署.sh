#!/bin/bash
# ==============================================
#   放置在部署包同目录 — 自动部署 (macOS / Linux)
#   解压 fast_start.tar 并启动服务
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PACKAGE_NAME="fast_start.tar"
BACKUP_DIR="$SCRIPT_DIR/backup-$(date +%Y%m%d-%H%M%S)"

# 加载共享函数库
source "$SCRIPT_DIR/../lib/common.sh"

echo "============================================"
echo "  自动部署 open-wsmud2"
echo "  平台: $(uname -s)"
echo "============================================"
echo ""

check_node
check_build_tools

# --- 检查部署包 ---
if [ ! -f "$SCRIPT_DIR/$PACKAGE_NAME" ]; then
    log_error "未找到 $PACKAGE_NAME"
    echo "  请确保本脚本与 $PACKAGE_NAME 在同一目录下。"
    exit 1
fi

# --- 校验包完整性 ---
verify_tar "$SCRIPT_DIR/$PACKAGE_NAME"

# --- 备份现有文件 (如果存在) ---
if [ -f "web.js" ] || [ -f "main.mjs" ]; then
    log_info "备份现有部署到 $BACKUP_DIR ..."
    mkdir -p "$BACKUP_DIR"
    shopt -s nullglob
    for f in web.js main.mjs config.js package.json package-lock.json; do
        [ -f "$f" ] && cp "$f" "$BACKUP_DIR/"
    done
    for d in node_modules os world www api web data; do
        [ -d "$d" ] && cp -r "$d" "$BACKUP_DIR/" 2>/dev/null || true
    done
    shopt -u nullglob
fi

# --- 解压 ---
log_info "解压 $PACKAGE_NAME ..."
cd "$SCRIPT_DIR"
tar -xf "$PACKAGE_NAME"
log_info "解压完成。"

# --- 确保依赖 ---
echo ""
ensure_deps

# --- 启动服务 ---
echo ""
start_services "$SCRIPT_DIR"
