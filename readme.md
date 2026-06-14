# MUD 游戏客户端+服务器

项目包含简化版的web服务器，使用sqlite作为数据存储，和游戏服务器共享数据，不支持分开部署。
完整版的web客户端，包含最新版本的所有前端代码
基础版的mud服务端，不支持多服务器，包含所有公共地图，几个副本和禁地，可参考开发。
默认管理账号密码为：administrator/123456，没有账号管理功能。
尽量不要管os/目录下的文件，年代久远代码混乱，能用就行
新增的改动放到world/extends目录下，可直接热更新。

## 项目结构

```
├── server/           # TypeScript 源码
│   ├── core/         #   游戏引擎（编译为 os/）
│   ├── res/          #   游戏世界内容（编译为 world/）
│   └── scripts/      #   部署脚本 (core → os/, res → world/)
├── os/               # 游戏核心引擎（角色、物品、房间、技能、任务）— 编译产物
├── world/            # 游戏世界内容（地图、NPC、物品、技能、门派、指令）— 编译产物
├── api/              # Web API 接口（用户、游戏）
├── web/              # Web 前端（登录、对话框、地图、游戏界面）
├── www/              # 前端构建产物（Vite 输出）
├── data/             # 数据库与数据文件（SQLite）
├── scripts/          # 部署脚本（打包、自动部署、启停）
├── tools/            # 辅助工具脚本
├── web.js            # Web 服务器入口
├── main.mjs          # 游戏服务器入口
├── config.js         # 配置加载
├── .env              # 环境变量
└── vite.config.js    # Vite 构建配置
```

## 环境要求

- Node.js >= 24.10.0

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 编译 TypeScript（server/ → os/ + world/）
cd server && npx tsc --outDir dist && cd ..
node server/scripts/deploy.mjs

# 3. 构建前端
npx vite build

# 4. 配置环境变量（ .env 文件）

# 5. 同时启动 Web 服务器和游戏服务器
npm start
```

启动后：

- Web 服务器运行在 **http://localhost:8088**
- 游戏服务器（WebSocket）运行在 **localhost:31300**

## 环境变量

`.env` 文件中的配置项：

| 变量               | 说明              | 默认值                |
|------------------|-----------------|--------------------|
| `WEB_HOST`       | Web 服务器监听地址     | `0.0.0.0`          |
| `WEB_PORT`       | Web 服务器端口       | `8088`             |
| `WS_HOST`        | 游戏服务器监听地址       | `127.0.0.1`        |
| `WS_PORT`        | 游戏 WebSocket 端口 | `31300`            |
| `SERVER_NAME`    | 服务器名称           | `本地测试`          |
| `MD5_PREFIX`     | MD5 加密前缀        | `12345`            |
| `SESSION_SECRET` | Session 密钥       | `123`              |
| `DESIV`          | DES 加密向量        | `1234123412341234` |

## 开发

### 编译 TypeScript

```bash
cd server
npx tsc --outDir dist
cd ..
node server/scripts/deploy.mjs    # core → os/, res → world/
```

### 前端开发

前端使用 Vite 构建，开发时支持热更新：

```bash
npm run dev
```

默认在 `http://localhost:3333` 启动开发服务器。修改 `src/` 目录下的文件会自动刷新。

### 构建前端

```bash
npm run build
```

构建产物输出到 `www/` 目录，由 Web 服务器静态托管。

### 单独启动服务

```bash
# 仅启动 Web 服务器
npm run web

# 仅启动游戏服务器
npm run os
```

### 调试模式

```bash
# Web 服务器调试模式
npm run web-debug

# 游戏服务器调试模式
npm run os-debug
```

两个命令均开启 Node.js `--inspect-brk`，启动后可用 Chrome DevTools 或 VS Code 进行断点调试。

## 可用脚本汇总

| 命令                  | 说明              |
|---------------------|-----------------|
| `npm start`         | 同时启动 Web 和游戏服务器 |
| `npm run web`       | 启动 Web 服务器      |
| `npm run os`        | 启动游戏服务器         |
| `npm run dev`       | 启动前端开发服务器       |
| `npm run build`     | 构建前端            |
| `npm run preview`   | 预览前端构建结果        |
| `npm run web-debug` | Web 服务器调试模式     |
| `npm run os-debug`  | 游戏服务器调试模式       |

## 游戏管理

没有管理工具，自己用命令或扩展cmd/admin/目录

``` javascript
//执行命令
SendCommand("call this.hp=1000000");
SendCommand("call user_id this.add_obj(obj_path,10)");

//热更新脚本文件(world/目录下的脚本代码可以热更新)
SendCommand("update cmd/admin/test");

```

## 生产环境快速部署

参见 [scripts/readme.MD](scripts/readme.MD)
