#!/bin/bash
# ==============================================
#   open-wsmud2 共享函数库
#   被所有 unix 部署脚本 source 引用
# ==============================================
set -e

# --- 颜色 ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# --- 项目根目录 ---
# 调用者通过 PROJECT_ROOT 传入；若未设定则自动探测 (package.json 所在目录)
detect_root() {
    if [ -n "$PROJECT_ROOT" ]; then
        echo "$PROJECT_ROOT"
        return
    fi
    local dir
    dir="$(cd "$(dirname "${BASH_SOURCE[1]}")" && pwd)"
    while [ "$dir" != "/" ] && [ ! -f "$dir/package.json" ]; do
        dir="$(dirname "$dir")"
    done
    if [ ! -f "$dir/package.json" ]; then
        log_error "未找到 package.json，请在项目根目录下运行此脚本"
        exit 1
    fi
    echo "$dir"
}

# --- 预检 ---
check_node() {
    if ! command -v node &>/dev/null; then
        log_error "未找到 Node.js，请先安装 Node.js 18+"
        exit 1
    fi
    log_info "Node.js $(node -v)"
}

check_npm() {
    if ! command -v npm &>/dev/null; then
        log_error "未找到 npm"
        exit 1
    fi
    log_info "npm $(npm -v)"
}

# --- 构建 (首次部署用: 含 npm install) ---
build_full() {
    local root="$1"
    cd "$root"

    log_info "安装依赖..."
    npm install
    echo ""

    log_info "编译 TypeScript..."
    cd "$root/server"
    npx tsc --outDir dist 2>/dev/null || log_warn "存在类型错误，JS 输出正常，继续..."
    cd "$root"
    echo ""

    log_info "运行部署 (core → os/, res → world/)..."
    node server/scripts/deploy.mjs
    echo ""

    log_info "构建前端..."
    npx vite build
    echo ""
}

# --- 构建 (更新用: 跳过 npm install) ---
build_light() {
    local root="$1"
    cd "$root"

    log_info "编译 TypeScript..."
    cd "$root/server"
    npx tsc --outDir dist 2>/dev/null || log_warn "存在类型错误，JS 输出正常，继续..."
    cd "$root"
    echo ""

    log_info "运行部署 (core → os/, res → world/)..."
    node server/scripts/deploy.mjs
    echo ""

    log_info "构建前端..."
    npx vite build
    echo ""
}

# --- 公用 tar 排除项 ---
# 注意:
#   - 不打包 node_modules/ (含 better-sqlite3 原生模块，必须由目标机器编译)
#   - 不打包 .env (避免覆盖服务器配置)
TAR_EXCLUDES=(
    --exclude='*.ts'
    --exclude='*.map'
    --exclude='.git'
    --exclude='.idea'
    --exclude='.vscode'
    --exclude='log'
    --exclude='auto_test'
    --exclude='tools'
    --exclude='old'
    --exclude='server'
    --exclude='scripts'
    --exclude='node_modules'
    --exclude='.env'
    --exclude='*.tar'
)

# 打包文件列表 (不含 node_modules — 原生模块需在目标平台编译)
TAR_FILES=(
    web.js main.mjs config.js
    package.json package-lock.json
    os/ world/ www/
    api/ web/ data/
)

# --- 打包 ---
# 所有包 (fast_start.tar / release.tar) 内容相同: 仅代码+资源，不含 node_modules
pack_release() {
    local root="$1" output="$2"
    cd "$root"
    log_info "打包 $output (不含 node_modules)..."
    tar -cf "$output" \
        "${TAR_FILES[@]}" \
        "${TAR_EXCLUDES[@]}" \
        2>/dev/null
    local size
    size=$(du -sh "$output" | cut -f1)
    log_info "打包完成: $output ($size)"
    echo "$output"
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

# --- PID 文件目录 (运行时) ---
PID_DIR="/tmp/open-wsmud2"

# --- 停止服务 (PID 文件优先 + pkill 兜底) ---
stop_services() {
    log_info "停止旧服务..."
    mkdir -p "$PID_DIR"

    # 优先用 PID 文件
    if [ -f "$PID_DIR/web.pid" ]; then
        kill "$(cat "$PID_DIR/web.pid")" 2>/dev/null && log_info "  Web 服务器已停止"
        rm -f "$PID_DIR/web.pid"
    fi
    if [ -f "$PID_DIR/game.pid" ]; then
        kill "$(cat "$PID_DIR/game.pid")" 2>/dev/null && log_info "  游戏服务器已停止"
        rm -f "$PID_DIR/game.pid"
    fi

    # 兜底: 按进程名清理
    pkill -f "node web\.js" 2>/dev/null || true
    pkill -f "node main\.mjs" 2>/dev/null || true
    sleep 1
}

# --- 启动服务 (记录 PID) ---
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

    # 等待任意一个退出
    wait -n 2>/dev/null || true
    stop_services
    log_info "服务已停止。"
}

# --- 重启服务 ---
restart_services() {
    stop_services
    start_services "$1"
}

# --- 安装/更新依赖 (目标机器上运行) ---
# 始终执行，确保 better-sqlite3 等原生模块针对当前平台编译正确
ensure_deps() {
    log_info "安装/更新依赖 (目标平台: $(uname -s))..."
    if [ -f "package-lock.json" ]; then
        npm ci --production 2>/dev/null || npm install --production
    else
        npm install --production
    fi
    log_info "依赖就绪"
}

# --- 检查构建工具 (目标机器需要编译 better-sqlite3) ---
check_build_tools() {
    if ! command -v make &>/dev/null && ! command -v gcc &>/dev/null; then
        log_warn "未检测到 make/gcc 编译工具"
        log_warn "better-sqlite3 需要在目标机器上编译原生模块"
        log_warn "请确保已安装 build-essential (Linux) 或 Xcode CLI (macOS)"
        echo ""
    fi
}
