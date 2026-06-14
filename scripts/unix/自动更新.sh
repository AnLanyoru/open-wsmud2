#!/bin/bash
# ==============================================
#   放置在更新包同目录 — 自动更新资源 (macOS / Linux)
#   解压 release.tar 覆盖到当前目录并重启
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PACKAGE_NAME="release.tar"
BACKUP_DIR="$SCRIPT_DIR/backup-$(date +%Y%m%d-%H%M%S)"

# 加载共享函数库
source "$SCRIPT_DIR/../lib/common.sh"

echo "============================================"
echo "  自动更新资源 open-wsmud2"
echo "  平台: $(uname -s)"
echo "============================================"
echo ""

# --- 检查更新包 ---
if [ ! -f "$SCRIPT_DIR/$PACKAGE_NAME" ]; then
    log_error "未找到 $PACKAGE_NAME"
    echo "  请确保本脚本与 $PACKAGE_NAME 在同一目录下。"
    exit 1
fi

# --- 校验包完整性 ---
verify_tar "$SCRIPT_DIR/$PACKAGE_NAME"

# --- 备份被覆盖的关键文件 ---
log_info "备份即将覆盖的文件..."
mkdir -p "$BACKUP_DIR"

# 备份 .env (重要!)
if [ -f "$SCRIPT_DIR/.env" ]; then
    cp "$SCRIPT_DIR/.env" "$BACKUP_DIR/"
fi

# 备份 config.js (可能有本地修改)
if [ -f "$SCRIPT_DIR/config.js" ]; then
    cp "$SCRIPT_DIR/config.js" "$BACKUP_DIR/"
fi

# 备份 package.json (依赖版本可能不同)
if [ -f "$SCRIPT_DIR/package.json" ]; then
    cp "$SCRIPT_DIR/package.json" "$BACKUP_DIR/"
fi

# --- 解压覆盖 ---
log_info "解压 $PACKAGE_NAME (覆盖现有文件)..."
cd "$SCRIPT_DIR"
tar -xf "$PACKAGE_NAME"
log_info "更新完成。"

# --- 还原 .env ---
if [ -f "$BACKUP_DIR/.env" ]; then
    cp "$BACKUP_DIR/.env" "$SCRIPT_DIR/"
    log_info ".env 已从备份还原"
fi

# --- 同步依赖 (更新可能引入新包，确保原生模块匹配平台) ---
echo ""
ensure_deps

# --- 重启服务 ---
echo ""
restart_services "$SCRIPT_DIR"
