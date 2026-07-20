#!/bin/bash
# ==============================================
#   放置在部署包同目录 — 自动部署 (macOS / Linux)
#   解压 fast_start.tar 并启动服务
#
#   本脚本为自包含版本，无需 common.sh 依赖，可直接随 tar 分发。
# ==============================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PACKAGE_NAME="fast_start.tar"
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

# --- 安装 Node.js (服务器端自动部署用) ---
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

# --- 安装编译工具 (better-sqlite3 需要本地编译) ---
ensure_build_tools() {
    if command -v make &>/dev/null && command -v gcc &>/dev/null; then
        log_info "编译工具已就绪 (gcc + make)"
        return 0
    fi
    log_warn "缺少编译工具 (better-sqlite3 需要本地编译)"
    log_info "安装 C++ 编译工具..."

    if [ "$(uname -s)" = "Linux" ]; then
        if command -v apt-get &>/dev/null; then
            sudo apt-get update -qq && sudo apt-get install -y build-essential python3
        elif command -v yum &>/dev/null; then
            sudo yum groupinstall -y "Development Tools" && sudo yum install -y python3
        elif command -v dnf &>/dev/null; then
            sudo dnf groupinstall -y "Development Tools" && sudo dnf install -y python3
        fi
    elif [ "$(uname -s)" = "Darwin" ]; then
        if ! xcode-select -p &>/dev/null; then
            log_info "安装 Xcode Command Line Tools..."
            xcode-select --install 2>/dev/null || true
            log_warn "请在弹出的对话框中确认安装，完成后重新运行本脚本"
            exit 0
        fi
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

# --- 安装/更新依赖 (目标机器上运行) ---
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

# --- 启动服务 (记录 PID) ---
start_services() {
    local dir="${1:-.}"
    cd "$dir"
    mkdir -p "$PID_DIR"

    stop_services

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

    # 等待任意一个退出 (兼容 bash 3.2 macOS)
    if ! wait -n 2>/dev/null; then
        while kill -0 "$web_pid" 2>/dev/null && kill -0 "$game_pid" 2>/dev/null; do
            sleep 1
        done
    fi
    stop_services
    log_info "服务已停止。"
}

# ============================================================
# 主流程
# ============================================================

echo "============================================"
echo "  自动部署 open-wsmud2"
echo "  平台: $(uname -s)"
echo "============================================"
echo ""

ensure_node
ensure_build_tools

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
    # 编译产物目录为 core/ res/ (而非旧版 os/ world/)
    for d in node_modules core res www api web data; do
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
