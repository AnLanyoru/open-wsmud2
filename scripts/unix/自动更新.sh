#!/bin/bash
# ==============================================
#   放置在更新包同目录 — 自动更新资源 (macOS / Linux)
#   解压 release.tar 覆盖到当前目录并重启
#
#   本脚本为自包含版本，无需 common.sh 依赖，可直接随 tar 分发。
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PACKAGE_NAME="release.tar"
BACKUP_DIR="$SCRIPT_DIR/backup-$(date +%Y%m%d-%H%M%S)"
PID_DIR="/tmp/open-wsmud2"
NODE_MIN=24

# --- 颜色日志 ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
log_info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# --- 安装 Node.js ---
install_node() {
    log_warn "未检测到 Node.js，正在自动安装..."

    if [ -s "$HOME/.nvm/nvm.sh" ]; then
        log_info "检测到 nvm，安装 Node.js ${NODE_MIN}..."
        export NVM_DIR="$HOME/.nvm"
        source "$NVM_DIR/nvm.sh"
        nvm install $NODE_MIN
        nvm use $NODE_MIN
        return 0
    fi

    if [ "$(uname -s)" = "Linux" ]; then
        log_info "通过 NodeSource 安装 Node.js ${NODE_MIN}.x..."
        if command -v curl &>/dev/null; then
            curl -fsSL "https://deb.nodesource.com/setup_${NODE_MIN}.x" | sudo -E bash - 2>/dev/null && \
                sudo apt-get install -y nodejs 2>/dev/null && return 0
            curl -fsSL "https://rpm.nodesource.com/setup_${NODE_MIN}.x" | sudo -E bash - 2>/dev/null && \
                sudo yum install -y nodejs 2>/dev/null && return 0
        fi
    fi

    if command -v apt-get &>/dev/null; then
        sudo apt-get update -qq && sudo apt-get install -y nodejs npm
    elif command -v yum &>/dev/null; then
        sudo yum install -y nodejs npm
    elif command -v dnf &>/dev/null; then
        sudo dnf install -y nodejs npm
    elif command -v brew &>/dev/null; then
        brew install node
    elif command -v pkg &>/dev/null; then
        sudo pkg install -y node npm
    else
        log_error "无法自动安装 Node.js，请手动安装: https://nodejs.org/"
        exit 1
    fi
}

ensure_node() {
    if command -v node &>/dev/null; then
        local ver
        ver=$(node -v | sed 's/v//' | cut -d. -f1)
        if [ "$ver" -ge "$NODE_MIN" ] 2>/dev/null; then
            log_info "Node.js $(node -v)"
            return 0
        fi
        log_warn "Node.js $(node -v) 版本过低，需要 >= ${NODE_MIN}"
    fi
    install_node
    if command -v node &>/dev/null; then
        log_info "Node.js $(node -v) 安装完成"
    else
        log_error "Node.js 安装失败，请手动安装: https://nodejs.org/"
        exit 1
    fi
}

# --- 校验 tar 完整性 ---
verify_tar() {
    local tarball="$1"
    if ! tar -tf "$tarball" &>/dev/null; then
        log_error "包文件损坏或无效: $tarball"
        exit 1
    fi
    log_info "包校验通过"
}

# --- 安装/更新依赖 ---
ensure_deps() {
    log_info "安装/更新依赖 (目标平台: $(uname -s))..."
    if [ -f "package-lock.json" ]; then
        npm ci --production 2>/dev/null || npm install --production
    else
        npm install --production
    fi
    log_info "依赖就绪"
}

# --- 停止服务 ---
stop_services() {
    log_info "停止旧服务..."
    mkdir -p "$PID_DIR"
    if [ -f "$PID_DIR/web.pid" ]; then
        kill "$(cat "$PID_DIR/web.pid")" 2>/dev/null && log_info "  Web 服务器已停止"
        rm -f "$PID_DIR/web.pid"
    fi
    if [ -f "$PID_DIR/game.pid" ]; then
        kill "$(cat "$PID_DIR/game.pid")" 2>/dev/null && log_info "  游戏服务器已停止"
        rm -f "$PID_DIR/game.pid"
    fi
    pkill -f "node web\.js" 2>/dev/null || true
    pkill -f "node main\.mjs" 2>/dev/null || true
    sleep 1
}

# --- 启动服务 ---
start_services() {
    local dir="${1:-.}"
    cd "$dir"
    mkdir -p "$PID_DIR"

    log_info "启动 Web 服务器 (http://localhost:8088)..."
    node web.js &
    echo $! > "$PID_DIR/web.pid"

    log_info "启动游戏服务器..."
    node main.mjs &
    echo $! > "$PID_DIR/game.pid"

    local web_pid game_pid
    web_pid=$(cat "$PID_DIR/web.pid")
    game_pid=$(cat "$PID_DIR/game.pid")
    log_info "服务已启动 (Web PID: $web_pid, Game PID: $game_pid)"

    if ! wait -n 2>/dev/null; then
        while kill -0 "$web_pid" 2>/dev/null && kill -0 "$game_pid" 2>/dev/null; do
            sleep 1
        done
    fi
    stop_services
    log_info "服务已停止。"
}

restart_services() {
    stop_services
    start_services "$1"
}

# ============================================================
# 主流程
# ============================================================

echo "============================================"
echo "  自动更新资源 open-wsmud2"
echo "  平台: $(uname -s)"
echo "============================================"
echo ""

ensure_node

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

# 备份 data/ 运行时数据 (数据库绝对不能丢)
if [ -d "$SCRIPT_DIR/data" ]; then
    cp -r "$SCRIPT_DIR/data" "$BACKUP_DIR/" 2>/dev/null || true
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

# --- 还原 data/ 运行时数据 (解压包不应覆盖数据库，但保险起见) ---
if [ -d "$BACKUP_DIR/data" ]; then
    # 仅还原 database.db 和玩家数据目录 (这些不在包内，但以防万一)
    [ -f "$BACKUP_DIR/data/database.db" ] && cp "$BACKUP_DIR/data/database.db" "$SCRIPT_DIR/data/" 2>/dev/null || true
    for d in 1 100 def; do
        [ -d "$BACKUP_DIR/data/$d" ] && cp -r "$BACKUP_DIR/data/$d" "$SCRIPT_DIR/data/" 2>/dev/null || true
    done
    log_info "data/ 运行时数据已从备份还原"
fi

# --- 同步依赖 (更新可能引入新包，确保原生模块匹配平台) ---
echo ""
ensure_deps

# --- 重启服务 ---
echo ""
restart_services "$SCRIPT_DIR"
