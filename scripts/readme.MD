# open-wsmud2 部署脚本使用指南

## 目录结构

```
scripts/
├── readme.MD                          ← 本文件
├── lib/
│   └── common.sh                      ← 共享函数库 (仅开发机使用)
├── unix/                              ← macOS / Linux
│   ├── 打包生成部署包.sh                → fast_start.tar
│   ├── 自动部署.sh                     → 解压+安装+启动 (自包含，可单独分发)
│   ├── 打包生成更新包.sh                → release.tar
│   ├── 自动更新.sh                     → 解压+重启 (自包含，可单独分发)
│   ├── start.sh / stop.sh / restart.sh
├── windows/                           ← Windows
│   ├── 打包生成部署包.bat / 自动部署.bat
│   ├── 打包生成更新包.bat / 自动更新.bat
│   └── start.bat / stop.bat / restart.bat
```

## 构建流程

打包脚本调用项目规范的构建入口 `scripts/pack.mjs`（即 `package.json` 的 `build` / `build-b` 脚本），流程：

```
npm install (仅首次部署包) → node scripts/pack.mjs [--binary] → npx vite build → tar 打包
```

`pack.mjs` 取代了旧版 `tsc + deploy.mjs` 两步流程，支持：

| 选项        | 说明                                            |
|-----------|-----------------------------------------------|
| _(无)_     | 普通编译：`tsc` 编译 `server/` → 复制到 `core/` `res/` |
| `--binary` | 启用二进制协议转换：`send_room` → `send_room_b`，生成客户端模板表 |
| `--metrics`| 注入性能监控埋点（调试用，启动后访问 `http://127.0.0.1:<port+1>/metrics`）|

## 包内容

| 包名              | 内容                                          |
|------------------|---------------------------------------------|
| `fast_start.tar` | 代码 + 资源 + `package.json` + `package-lock.json`，不含 `node_modules` 和 `.env` |
| `release.tar`    | 同上                                          |

`node_modules` 不在包内，由目标服务器 `npm ci --production` 本地编译（`better-sqlite3` 是原生模块）。
`data/` 目录下的运行时数据（`database.db`、玩家数据 `1/100/`、`def/`）已通过 tar 排除项过滤，不会覆盖目标服务器数据。

## 前置条件

目标服务器需要 **Node.js 24+** 及 C++ 编译工具：

| 平台      | 编译工具                                                   |
|----------|----------------------------------------------------------|
| Linux    | `apt install build-essential` 或 `yum install gcc-c++ make` |
| macOS    | `xcode-select --install`                                 |
| Windows  | Visual Studio Build Tools 或 `npm install -g windows-build-tools` |

## 一、首次部署

**开发机打包：**
```bash
bash scripts/unix/打包生成部署包.sh              # macOS / Linux，普通编译
bash scripts/unix/打包生成部署包.sh --binary     # 启用二进制协议
```
```cmd
scripts\windows\打包生成部署包.bat                :: Windows，普通编译
scripts\windows\打包生成部署包.bat --binary       :: 启用二进制协议
```

**复制到服务器（放在同一目录）：**
- `fast_start.tar`
- `unix/自动部署.sh`（或 `windows/自动部署.bat`）

> 自动部署/更新脚本为**自包含**版本，无需 `common.sh` 依赖，可直接随 tar 分发。

**服务器上运行：**
```bash
bash 自动部署.sh
```

## 二、更新资源

**开发机打包：**
```bash
bash scripts/unix/打包生成更新包.sh              # 普通编译
bash scripts/unix/打包生成更新包.sh --binary     # 启用二进制协议
```
```cmd
scripts\windows\打包生成更新包.bat                :: 普通编译
scripts\windows\打包生成更新包.bat --binary       :: 启用二进制协议
```

**复制到服务器（放在同一目录）：**
- `release.tar`
- `unix/自动更新.sh`（或 `windows/自动更新.bat`）

**服务器上运行：**
```bash
bash 自动更新.sh
```

更新流程会自动备份并还原 `.env`、`config.js`、`data/` 运行时数据，避免覆盖服务器配置和数据库。

## 三、日常维护

### macOS / Linux
```bash
bash scripts/unix/start.sh              # 启动
bash scripts/unix/stop.sh               # 停止
bash scripts/unix/restart.sh            # 重启
```

### Windows
```cmd
scripts\windows\start.bat                :: 启动
scripts\windows\stop.bat                 :: 停止
scripts\windows\restart.bat              :: 重启
```

Windows 脚本使用 **PID 文件**（`%TEMP%\open-wsmud2\web.pid` / `game.pid`）管理进程，
仅停止本项目服务，不会误杀其他 `node.exe` 进程。
服务输出重定向到 `log\web.log` / `log\game.log`，可用 `type log\web.log` 查看。

## 四、二进制协议模式

`--binary` 模式将服务端的 `send_room("...")` / `send_combat("...")` 调用转换为模板 ID，
通过二进制帧发送，显著降低网络带宽。客户端模板表 (`www/tmpl_<hash>.gz`) 由 Vite 构建时自动生成。

详见 [BINARY_ARCHITECTURE.md](../BINARY_ARCHITECTURE.md)。

**注意：** 普通模式和二进制模式的客户端不兼容，部署时需保持开发机和目标服务器使用相同模式。
