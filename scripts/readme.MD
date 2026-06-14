# open-wsmud2 部署脚本使用指南

## 目录结构

```
scripts/
├── readme.MD                          ← 本文件
├── lib/
│   └── common.sh                      ← 共享函数库
├── unix/                              ← macOS / Linux
│   ├── 打包生成部署包.sh                → fast_start.tar
│   ├── 自动部署.sh                     → 解压+安装+启动
│   ├── 打包生成更新包.sh                → release.tar
│   ├── 自动更新.sh                     → 解压+重启
│   ├── start.sh / stop.sh / restart.sh
├── windows/                           ← Windows
│   ├── 打包生成部署包.bat / 自动部署.bat
│   ├── 打包生成更新包.bat / 自动更新.bat
│   └── start.bat / stop.bat / restart.bat
├── 首次部署/                           ← [已弃用]
├── 打包资源/                           ← [已弃用]
└── 启动脚本/                           ← [已弃用]
```

## 包内容

| 包名 | 内容 |
|------|------|
| `fast_start.tar` | 代码 + 资源 + `package.json` + `package-lock.json`，不含 `node_modules` 和 `.env` |
| `release.tar` | 同上 |

`node_modules` 不在包内，由目标服务器 `npm ci --production` 本地编译（`better-sqlite3` 是原生模块）。

## 前置条件

目标服务器需要 Node.js 18+ 及 C++ 编译工具：

| 平台 | 编译工具 |
|------|---------|
| Linux | `apt install build-essential` 或 `yum install gcc-c++ make` |
| macOS | `xcode-select --install` |
| Windows | `npm install -g windows-build-tools` 或 Visual Studio Build Tools |

## 一、首次部署

**开发机打包：**
```bash
bash scripts/unix/打包生成部署包.sh      # macOS / Linux
scripts\windows\打包生成部署包.bat        # Windows
```

**复制到服务器（放在同一目录）：**
- `fast_start.tar`
- `unix/自动部署.sh`（或 `windows/自动部署.bat`）

**服务器上运行：**
```bash
bash 自动部署.sh
```

## 二、更新资源

**开发机打包：**
```bash
bash scripts/unix/打包生成更新包.sh
scripts\windows\打包生成更新包.bat
```

**复制到服务器（放在同一目录）：**
- `release.tar`
- `unix/自动更新.sh`（或 `windows/自动更新.bat`）

**服务器上运行：**
```bash
bash 自动更新.sh
```

## 三、日常维护

```bash
bash scripts/unix/start.sh              # 启动
bash scripts/unix/stop.sh               # 停止
bash scripts/unix/restart.sh            # 重启
```
