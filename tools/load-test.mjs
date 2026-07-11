#!/usr/bin/env node
/**
 * wsmud 负载测试模拟器 v3.0
 *
 * 直接对接游戏服务器 WebSocket 协议，模拟真实玩家行为：
 *   1. 客户端生成 session token（AES-128-CBC，匹配服务端 USERLOGIN.check_session）
 *   2. WebSocket 连接游戏服务器
 *   3. 发送 testrole 命令一键建角
 *   4. 按频率发送真实游戏命令
 *   5. 采集 RTT / 吞吐 / 错误 / 资源 指标
 *
 * 用法:
 *   1. 修改文件顶部 CONFIG 对象（服务器、玩家数、账号等）
 *   2. node tools/load-test.mjs
 *   3. 也可用 CLI 参数临时覆盖: node tools/load-test.mjs --players 100 --duration 60
 *
 * 前置条件:
 *   - 游戏服务器已启动（默认 ws://127.0.0.1:31300）
 *   - CONFIG 中填写 desiv 和 md5Prefix，或留空自动从 .env 读取
 */

import { performance } from 'perf_hooks';
import v8 from 'v8';
import { WebSocket } from 'ws';
import os from 'os';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// ============================================================
// 常量
// ============================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** 门派映射 — 与 server/res/cmd/comm/testrole.ts 保持一致 */
const FAMILY_MAP = {
    1: 'wudang', 2: 'shaolin', 3: 'huashan', 4: 'gaibang',
    5: 'emei', 6: 'xiaoyao', 7: 'shashou', 8: 'liushan', 9: 'wulang',
};

/** 武器类型列表 */
const WEAPON_TYPES = ['sword', 'blade', 'unarmed', 'staff', 'club', 'whip', 'throwing'];

/**
 * 预置流程池 — 指令用 ; 分割即为多步流程，玩家随机抽取并逐步执行
 */
const COMMAND_POOL = [
    ['jh fam 5 start;go east;go north;kill random;kill random;kill random', { weight: 5 }],
    ['jh fam 4 start;go west;go south;go west;go west;kill random;kill random;kill random', { weight: 5 }],
    ['jh fam 3 start;go westup;go north;go north;go east;kill random;kill random;kill random', { weight: 3 }],
    ['jh fam 2 start;go north;go west;kill random;kill random;kill random', { weight: 2 }],
    ['jh fam 2 start;go north;go east;kill random;kill random;kill random', { weight: 2 }],
    ['jh fam 1 start;go west;go west;kill random;kill random;kill random', { weight: 5 }],
];

/** 加权展开：每条记录是分号分隔的步骤数组 */
const WEIGHTED_FLOWS = (() => {
    const pool = [];
    for (const [cmd, { weight }] of COMMAND_POOL) {
        const steps = cmd.split(';');
        for (let i = 0; i < weight; i++) pool.push(steps);
    }
    return pool;
})();

// ============================================================
// 工具函数
// ============================================================

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
    return arr[randInt(0, arr.length - 1)];
}

function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatMs(ms) {
    if (ms < 1000) return ms.toFixed(1) + ' ms';
    return (ms / 1000).toFixed(2) + ' s';
}

function calcPercentile(sorted, p) {
    if (!sorted.length) return 0;
    const idx = Math.min(sorted.length - 1, Math.floor(sorted.length * p));
    return sorted[idx];
}

// ============================================================
// ⚙️  配置 —— 直接改这里就能跑，无需命令行参数
// ============================================================
const CONFIG = {
    // ---- 服务器 ----
    host: '127.0.0.1',
    port: 31300,           // 连网关，不直连游戏服务器

    // ---- 测试参数 ----
    players: 5,           // 模拟玩家数
    batchSize: 20,        // 每批并发连接数
    batchInterval: 100,   // 批次间隔（毫秒）
    stepDelay: 500,       // 流程步骤间隔（毫秒）

    // ---- 账号 ----
    // 默认使用本地账号: localhost1, localhost2... 密码均为 localhost
    // 服务器识别本地连接后跳过数据库验证，直接放行，无需预先建号
    accountPrefix: 'localhost',
    accountStart: 1,
    accountPassword: 'localhost',

    // 也可从 JSON 文件加载（设置后优先，注释掉则用上面的自动生成）
    // accountsFile: './test-accounts.json',

    // ---- Session 加密 ----
    // 直接填写，或留空字符串自动从项目根目录 .env 读取
    desiv: '',
    md5Prefix: '',
};

/**
 * 从 .env 文件读取指定 key（仅当 CONFIG 中未填写时使用）
 */
function readEnv(key) {
    const envPath = path.resolve(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) return '';
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const k = trimmed.substring(0, eqIdx).trim();
        if (k !== key) continue;
        // dotenv 不剥引号，保持一致
        return trimmed.substring(eqIdx + 1).trim();
    }
    return '';
}

// ============================================================
// Session Token 生成器
// ============================================================

class SessionGenerator {
    /**
     * @param {string|Buffer} desiv - DES 加密向量（16 字节）
     * @param {string} md5Prefix - MD5 加盐前缀
     */
    constructor(desiv, md5Prefix) {
        // desiv 可能已经是 Buffer（从 JS config 导入）或 string（从 .env 读取）
        this.desiv = typeof desiv === 'string' ? Buffer.from(desiv, 'utf8') : desiv;
        this.md5Prefix = md5Prefix;
    }

    /**
     * 计算服务端 MD5(password + md5Prefix)
     * @param {string} password - 明文密码
     * @returns {string} 大写 MD5 十六进制
     */
    hashPassword(password) {
        return crypto.createHash('md5')
            .update(password + this.md5Prefix)
            .digest('hex')
            .toUpperCase();
    }

    /**
     * AES-128-CBC 加密
     * @param {string} plaintext - 明文
     * @param {string} key - 密钥（取前 16 字节）
     * @returns {string} base64 密文
     */
    encrypt(plaintext, key) {
        if (key.length > 16) key = key.slice(0, 16);
        const keyBuf = Buffer.from(key, 'utf8');
        const cipher = crypto.createCipheriv('aes-128-cbc', keyBuf, this.desiv);
        let result = cipher.update(plaintext, 'utf8', 'base64');
        result += cipher.final('base64');
        return result;
    }

    /**
     * 生成 session token
     * 加密格式与 api/base.js 的 encryptUser 完全一致:
     *   plaintext = id%name%pwd%timestamp%level
     *
     * @param {number} userId - 账号 ID
     * @param {string} username - 用户名
     * @param {string} password - 明文密码
     * @param {number} level - 用户等级 (0=普通)
     * @returns {{ sessionKey: string, cert: string }}
     */
    generateToken(userId, username, password, level = 0) {
        const pwdMD5 = this.hashPassword(password);
        const sessionKey = crypto.randomBytes(8).toString('hex'); // 16 hex chars
        const plaintext = `${userId}%${username}%${pwdMD5}%${Date.now()}%${level}`;
        const cert = this.encrypt(plaintext, sessionKey);
        return { sessionKey, cert };
    }
}

// ============================================================
// 模拟玩家
// ============================================================

class SimPlayer {
    /**
     * @param {number} index - 序号
     * @param {{ userId: number, username: string, password: string, level?: number }} account
     */
    constructor(index, account) {
        this.index = index;
        this.userId = account.userId;
        this.username = account.username;
        this.password = account.password;
        this.level = account.level ?? 0;

        // 随机门派和武器
        this.familyKey = randInt(1, 9);
        this.weaponType = randChoice(WEAPON_TYPES);

        // 连接状态
        this.socket = null;
        this.connected = false;       // WS 连接已建立
        this.authenticated = false;   // session 验证通过
        this.loggedIn = false;        // 角色已创建，进入游戏
        this.loginFailed = false;     // 登录失败

        // 统计
        this.commandsSent = 0;
        this.bytesIn = 0;
        this.bytesOut = 0;
        this.messagesReceived = 0;
        this.latencies = [];          // ping-pong RTT (ms)
        this.errors = 0;
        this.connectTime = 0;         // 连接建立耗时 (ms)
        this.loginTime = 0;           // 登录耗时 (ms)
        this.msgLog = [];             // 5人以下时记录完整消息
        this.flow = null;             // 当前执行的流程步骤数组
        this.flowStep = 0;            // 当前步骤下标
    }

    /** 获取下一步指令：流程走完返回 null，不自动抽新流程 */
    nextCommand() {
        if (!this.flow) {
            this.flow = randChoice(WEIGHTED_FLOWS);
            this.flowStep = 0;
        }
        if (this.flowStep >= this.flow.length) return null;
        return this.flow[this.flowStep++];
    }
}

// ============================================================
// 性能分析器
// ============================================================

class Profiler {
    constructor() {
        this.startTime = performance.now();
        this.startCpu = process.cpuUsage();
        this.evLoopDelays = [];
        this._timer = null;
        this._running = false;
    }

    start() {
        this._running = true;
        this._timer = setInterval(() => {
            if (!this._running) return;
            const t0 = performance.now();
            setImmediate(() => {
                const delay = performance.now() - t0;
                this.evLoopDelays.push(delay);
                if (this.evLoopDelays.length > 1000) this.evLoopDelays.shift();
            });
        }, 100);
    }

    stop() {
        this._running = false;
        if (this._timer) { clearInterval(this._timer); this._timer = null; }
    }

    /** @returns {{ avg: number, max: number, p50: number, p95: number, p99: number }} */
    getEvLoopStats() {
        if (!this.evLoopDelays.length) return { avg: 0, max: 0, p50: 0, p95: 0, p99: 0 };
        const sorted = [...this.evLoopDelays].sort((a, b) => a - b);
        return {
            avg: sorted.reduce((a, b) => a + b, 0) / sorted.length,
            max: sorted[sorted.length - 1],
            p50: calcPercentile(sorted, 0.5),
            p95: calcPercentile(sorted, 0.95),
            p99: calcPercentile(sorted, 0.99),
        };
    }

    getReport() {
        const elapsed = (performance.now() - this.startTime) / 1000;
        const cpuTotal = process.cpuUsage(this.startCpu);
        const mem = process.memoryUsage();
        const safeElapsed = Math.max(elapsed, 0.001);
        return {
            elapsed,
            cpu: {
                userMs: (cpuTotal.user / 1000).toFixed(1),
                systemMs: (cpuTotal.system / 1000).toFixed(1),
                userPct: (cpuTotal.user / 1000 / safeElapsed * 100).toFixed(1) + '%',
                systemPct: (cpuTotal.system / 1000 / safeElapsed * 100).toFixed(1) + '%',
            },
            memory: {
                rss: formatBytes(mem.rss),
                heapTotal: formatBytes(mem.heapTotal),
                heapUsed: formatBytes(mem.heapUsed),
                external: formatBytes(mem.external),
            },
            heapLimit: formatBytes(v8.getHeapStatistics().heap_size_limit),
            evLoopDelay: this.getEvLoopStats(),
        };
    }
}

// ============================================================
// 负载测试引擎
// ============================================================

class LoadTestEngine {
    constructor(options) {
        this.playerCount = options.players || 100;
        this.host = options.host || '127.0.0.1';
        this.port = options.port || 31300;
        this.batchSize = options.batchSize || 20;
        this.stepDelay = options.stepDelay || 500;
        this.batchInterval = options.batchInterval || 100;

        // Session 生成器
        this.sessionGen = new SessionGenerator(options.desiv, options.md5Prefix);

        this.profiler = new Profiler();
        this.players = [];
        this.running = false;
        this._ending = false;   // 是否正在主动断开（测试结束）

        // 实时统计
        this.stats = {
            connects: 0,
            connectFails: 0,
            authOk: 0,
            authFail: 0,
            logins: 0,
            loginFails: 0,
            disconnects: 0,
            totalCommands: 0,
            totalMessages: 0,
            totalBytesIn: 0,
            totalBytesOut: 0,
            errors: 0,
        };

        // ping 追踪
        this._pendingPings = new Map();

        // 吞吐采样：每秒记录一次
        this._throughputSamples = [];
        this._tpLastBytesIn = 0;
        this._tpLastBytesOut = 0;
        this._tpTimer = null;
    }

    _startThroughputSampler() {
        this._tpLastBytesIn = this.stats.totalBytesIn;
        this._tpLastBytesOut = this.stats.totalBytesOut;
        this._tpTimer = setInterval(() => {
            const inDelta = this.stats.totalBytesIn - this._tpLastBytesIn;
            const outDelta = this.stats.totalBytesOut - this._tpLastBytesOut;
            this._throughputSamples.push({ bytesIn: inDelta, bytesOut: outDelta });
            this._tpLastBytesIn = this.stats.totalBytesIn;
            this._tpLastBytesOut = this.stats.totalBytesOut;
        }, 1000);
    }

    _stopThroughputSampler() {
        if (this._tpTimer) { clearInterval(this._tpTimer); this._tpTimer = null; }
    }

    // ============================================================
    // 初始化
    // ============================================================

    /**
     * @param {Array<{userId: number, username: string, password: string, level?: number}>} accounts
     */
    initPlayers(accounts) {
        if (accounts.length < this.playerCount) {
            console.error(`[错误] 账号数量(${accounts.length})不足，需要 ${this.playerCount} 个`);
            console.error('  请通过 --accounts-file 提供足够账号，或使用 --account-prefix 自动生成');
            process.exit(1);
        }

        console.log(`\n[初始化] 准备 ${this.playerCount} 个模拟玩家...`);
        this.players = [];
        for (let i = 0; i < this.playerCount; i++) {
            this.players.push(new SimPlayer(i + 1, accounts[i]));
        }

        // 门派/武器分布统计
        const families = {};
        const weapons = {};
        for (const p of this.players) {
            families[p.familyKey] = (families[p.familyKey] || 0) + 1;
            weapons[p.weaponType] = (weapons[p.weaponType] || 0) + 1;
        }
        console.log(`  门派分布(key): ${JSON.stringify(families)}`);
        console.log(`  武器分布: ${JSON.stringify(weapons)}`);
    }

    // ============================================================
    // 主流程
    // ============================================================

    async run() {
        const wsUrl = `ws://${this.host}:${this.port}`;

        console.log(`\n[目标] ${wsUrl}`);
        console.log(`[配置] ${this.playerCount} 玩家, 批次=${this.batchSize}, 步骤间隔=${this.stepDelay}ms`);
        console.log(`[Session] DESIV=${this.sessionGen.desiv.length}bytes, MD5前缀=${this.sessionGen.md5Prefix}`);

        this.profiler.start();
        this.running = true;

        // ---- 第1步: 批量连接 + 认证 + 建角 ----
        console.log(`\n[步骤1] 连接 WebSocket，认证并创建角色...`);
        await this._batchConnect(wsUrl);

        const connected = this.players.filter(p => p.connected).length;
        console.log(`\n[结果] 连接=${connected} 失败=${this.stats.connectFails}`);

        if (connected === 0) {
            console.error('[错误] 无玩家成功连接，退出测试');
            this.running = false;
            this.profiler.stop();
            return;
        }

        // ---- 第2步: 发送 testrole 建角 ----
        console.log(`\n[步骤2] 发送 testrole 建角...`);
        for (const p of this.players) {
            if (p.connected && p.socket?.readyState === WebSocket.OPEN) {
                this._send(p, `testrole ${p.familyKey} ${p.weaponType}`);
            }
        }
        await new Promise(r => setTimeout(r, this.stepDelay));

        // ---- 第3步: 每人抽一个流程执行 ----
        console.log(`\n[步骤3] ${connected} 个玩家各抽取一个流程执行...`);
        console.log('-'.repeat(70));

        this._startThroughputSampler();
        const flowStart = performance.now();
        let activePlayers = this.players.filter(p => p.connected && p.socket?.readyState === WebSocket.OPEN);
        let lastPrintSec = 0;

        while (activePlayers.length > 0 && this.running) {
            const promises = [];
            for (const p of activePlayers) {
                promises.push(this._sendCommand(p));
            }
            await Promise.allSettled(promises);

            activePlayers = activePlayers.filter(p => p.flow && p.flowStep < p.flow.length);

            const elapsedSec = Math.round((performance.now() - flowStart) / 1000);
            if (elapsedSec - lastPrintSec >= 5 || activePlayers.length === 0) {
                lastPrintSec = elapsedSec;
                const rateSec = Math.max(1, elapsedSec);
                console.log(
                    `  [${elapsedSec}s] 在线:${activePlayers.length} | ` +
                    `实时吞吐 下行 ${formatBytes(Math.round(this.stats.totalBytesIn / rateSec))}/s  ` +
                    `上行 ${formatBytes(Math.round(this.stats.totalBytesOut / rateSec))}/s | ` +
                    `累计 收 ${formatBytes(this.stats.totalBytesIn)} 发 ${formatBytes(this.stats.totalBytesOut)}`,
                );
            }

            if (activePlayers.length > 0) {
                await new Promise(r => setTimeout(r, this.stepDelay));
            }
        }

        this._stopThroughputSampler();

        // ---- 第4步: 保活等待手动停止 ----
        console.log('\n[完成] 所有玩家流程执行完毕，连接保持中 (Ctrl+C 退出)...');
        const keepAlive = setInterval(() => {
            for (const p of this.players) {
                if (p.socket?.readyState === WebSocket.OPEN) {
                    try { p.socket.send('ping'); } catch (_) {}
                }
            }
        }, 30000);

        await new Promise(r => {
            const onSig = () => {
                process.removeListener('SIGINT', onSig);
                clearInterval(keepAlive);
                r();
            };
            process.on('SIGINT', onSig);
        });

        console.log('\n[断开] 关闭所有连接...');
        this._ending = true;
        for (const p of this.players) {
            if (p.socket) {
                try { p.socket.close(); } catch (_) { /* ignore */ }
            }
        }
        await new Promise(r => setTimeout(r, 500));

        this.profiler.stop();
    }

    // ============================================================
    // 批量连接
    // ============================================================

    async _batchConnect(wsUrl) {
        for (let i = 0; i < this.players.length; i += this.batchSize) {
            const batch = this.players.slice(i, i + this.batchSize);
            const results = await Promise.allSettled(
                batch.map(p => this._connectOne(wsUrl, p))
            );
            const ok = results.filter(r => r.status === 'fulfilled' && r.value).length;
            const done = Math.min(i + this.batchSize, this.players.length);
            console.log(`  进度 ${done}/${this.players.length} (本批成功=${ok})`);
            if (i + this.batchSize < this.players.length) {
                await new Promise(r => setTimeout(r, this.batchInterval));
            }
        }
    }

    /**
     * 连接单个玩家 — 纯发送模式，不处理服务端消息
     */
    _connectOne(wsUrl, player) {
        const connectStart = performance.now();
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                this.stats.connectFails++;
                if (player.socket) { try { player.socket.terminate(); } catch (_) { } }
                resolve(false);
            }, 10000);

            try {
                const ws = new WebSocket(wsUrl);
                player.socket = ws;

                ws.on('open', () => {
                    player.connected = true;
                    player.connectTime = performance.now() - connectStart;
                    this.stats.connects++;

                    const token = this.sessionGen.generateToken(
                        player.userId, player.username, player.password, player.level,
                    );
                    ws.send(`${token.sessionKey} ${token.cert}`);
                    clearTimeout(timeout);
                    resolve(true);
                });

                ws.on('message', () => {});  // 忽略消息，网关统计

                ws.on('error', () => {
                    this.stats.errors++;
                    clearTimeout(timeout);
                    resolve(false);
                });

                ws.on('close', () => {
                    player.connected = false;
                    if (!this._ending) this.stats.disconnects++;
                });

            } catch (_) {
                this.stats.connectFails++;
                clearTimeout(timeout);
                resolve(false);
            }
        });
    }

    /**
     * 处理登录阶段的服务端消息
     */
    // ============================================================
    // 发送命令
    // ============================================================

    /** 发送并记录 */
    _send(player, data) {
        player.socket.send(data);
        if (this.playerCount <= 5) {
            player.msgLog.push({ time: Date.now(), dir: 'send', data });
        }
    }

    async _sendCommand(player) {
        const cmd = player.nextCommand();
        if (!cmd) return;  // 流程已走完
        try {
            this._send(player, cmd);
            player.commandsSent++;
            const bytes = Buffer.byteLength(cmd, 'utf8');
            player.bytesOut += bytes;
            this.stats.totalCommands++;
            this.stats.totalBytesOut += bytes;
        } catch (_) {
            this.stats.errors++;
            player.errors++;
        }
    }

    // ============================================================
    // 进度输出
    // ============================================================

    _printFlowProgress(remaining) {
        const done = this.players.filter(p => p.loggedIn).length - remaining;
        console.log(
            `[流程] 已完成:${done} 剩余:${remaining} ` +
            `命令:${this.stats.totalCommands} 消息:${this.stats.totalMessages} ` +
            `收:${formatBytes(this.stats.totalBytesIn)} 发:${formatBytes(this.stats.totalBytesOut)}`,
        );
    }

    _printProgress(elapsed) {
        const mem = process.memoryUsage();
        const conn = this.players.filter(p => p.connected).length;
        const loggedIn = this.players.filter(p => p.loggedIn).length;

        let rttStr = '';
        const allLat = this.players.flatMap(p => p.latencies);
        if (allLat.length > 0) {
            const sorted = [...allLat].sort((a, b) => a - b);
            const avg = (sorted.reduce((a, b) => a + b, 0) / sorted.length).toFixed(0);
            const p99 = calcPercentile(sorted, 0.99).toFixed(0);
            rttStr = ` RTT_avg=${avg}ms p99=${p99}ms`;
        }

        console.log(
            `[${elapsed.toFixed(1)}s] ` +
            `在线:${conn} 已登录:${loggedIn} ` +
            `命令:${this.stats.totalCommands} ` +
            `消息:${this.stats.totalMessages} ` +
            `收:${formatBytes(this.stats.totalBytesIn)} ` +
            `发:${formatBytes(this.stats.totalBytesOut)} ` +
            `堆:${formatBytes(mem.heapUsed)} ` +
            `RSS:${formatBytes(mem.rss)}` +
            rttStr,
        );
    }

    // ============================================================
    // 报告
    // ============================================================

    /**
     * 门派 key → 中文名
     */
    _familyName(key) {
        const map = { 1: '武当', 2: '少林', 3: '华山', 4: '丐帮', 5: '峨眉', 6: '逍遥', 7: '杀手', 8: '留山', 9: '无浪' };
        return map[key] || `门派${key}`;
    }

    /**
     * 武器类型 → 中文名
     */
    _weaponName(type) {
        const map = { sword: '剑', blade: '刀', unarmed: '拳脚', staff: '杖', club: '棍', whip: '鞭', throwing: '暗器' };
        return map[type] || type;
    }

    generateReport() {
        const perfReport = this.profiler.getReport();

        // RTT 统计
        const allLat = this.players.flatMap(p => p.latencies).sort((a, b) => a - b);
        const rttStats = allLat.length > 0 ? {
            平均延迟: calcPercentile(allLat, 0.5).toFixed(1) + 'ms',
            P50: calcPercentile(allLat, 0.5).toFixed(1) + 'ms',
            P95: calcPercentile(allLat, 0.95).toFixed(1) + 'ms',
            P99: calcPercentile(allLat, 0.99).toFixed(1) + 'ms',
            最大延迟: allLat[allLat.length - 1]?.toFixed(1) + 'ms',
            样本数: allLat.length,
        } : { 平均延迟: '无数据', P50: '无数据', P95: '无数据', P99: '无数据', 最大延迟: '无数据', 样本数: 0 };

        // 连接耗时
        const connectTimes = this.players.filter(p => p.connectTime > 0).map(p => p.connectTime);
        const loginTimes = this.players.filter(p => p.loggedIn).map(p => p.loginTime);

        const activePlayers = this.players.filter(p => p.loggedIn).length || 1;

        // 门派分布 → 中文
        const familiesCN = {};
        const weaponsCN = {};
        for (const p of this.players) {
            const fname = this._familyName(p.familyKey);
            familiesCN[fname] = (familiesCN[fname] || 0) + 1;
            const wname = this._weaponName(p.weaponType);
            weaponsCN[wname] = (weaponsCN[wname] || 0) + 1;
        }

        return {
            测试配置: {
                目标服务器: `ws://${this.host}:${this.port}`,
                模拟玩家数: this.playerCount,
                步骤间隔: this.stepDelay + 'ms',
                并发批次: this.batchSize,
            },
            客户端性能: {
                总耗时: perfReport.elapsed.toFixed(1) + '秒',
                CPU用户态: perfReport.cpu.userPct,
                CPU内核态: perfReport.cpu.systemPct,
                物理内存RSS: perfReport.memory.rss,
                堆内存已用: perfReport.memory.heapUsed,
                堆内存上限: perfReport.memory.heapTotal,
                堆内存总上限: perfReport.heapLimit,
                事件循环延迟: {
                    平均: perfReport.evLoopDelay.avg.toFixed(2) + 'ms',
                    P50: perfReport.evLoopDelay.p50.toFixed(2) + 'ms',
                    P95: perfReport.evLoopDelay.p95.toFixed(2) + 'ms',
                    P99: perfReport.evLoopDelay.p99.toFixed(2) + 'ms',
                    最大: perfReport.evLoopDelay.max.toFixed(2) + 'ms',
                },
            },
            网络通信: {
                往返延迟RTT: rttStats,
                总接收数据: formatBytes(this.stats.totalBytesIn),
                总发送数据: formatBytes(this.stats.totalBytesOut),
                人均接收: formatBytes(this.stats.totalBytesIn / activePlayers),
                人均发送: formatBytes(this.stats.totalBytesOut / activePlayers),
                峰值下行速率: formatBytes(Math.max(0, ...this._throughputSamples.map(s => s.bytesIn))) + '/s',
                峰值上行速率: formatBytes(Math.max(0, ...this._throughputSamples.map(s => s.bytesOut))) + '/s',
                平均下行速率: formatBytes(this._throughputSamples.length
                    ? Math.round(this._throughputSamples.reduce((a, s) => a + s.bytesIn, 0) / this._throughputSamples.length) : 0) + '/s',
                平均上行速率: formatBytes(this._throughputSamples.length
                    ? Math.round(this._throughputSamples.reduce((a, s) => a + s.bytesOut, 0) / this._throughputSamples.length) : 0) + '/s',
            },
            连接统计: {
                计划连接数: this.playerCount,
                连接成功: this.stats.connects,
                连接失败: this.stats.connectFails,
                中途断线: this.stats.disconnects,
            },
            玩家分布: {
                门派: familiesCN,
                武器: weaponsCN,
            },
            活动统计: {
                发送命令总数: this.stats.totalCommands,
                收到消息总数: this.stats.totalMessages,
                人均发送命令: (this.stats.totalCommands / activePlayers).toFixed(1) + '条',
                人均收到消息: (this.stats.totalMessages / activePlayers).toFixed(1) + '条',
                错误次数: this.stats.errors,
            },
            ...(this.playerCount <= 5 ? {
                消息记录: this.players.map(p => ({
                    玩家: p.username,
                    门派: this._familyName(p.familyKey),
                    武器: this._weaponName(p.weaponType),
                    消息: p.msgLog.map(m => ({
                        时间: new Date(m.time).toISOString().slice(11, 23),
                        方向: m.dir === 'send' ? '发出' : '收到',
                        内容: m.data,
                    })),
                })),
            } : {}),
        };
    }

    printReport() {
        const r = this.generateReport();

        console.log('\n' + '═'.repeat(64));
        console.log('                  ⚔️  负载测试报告  ⚔️');
        console.log('═'.repeat(64));

        // ── 测试配置 ──
        const cfg = r.测试配置;
        console.log('\n┌─ 测试配置 ─────────────────────────────────────────────┐');
        console.log(`│  目标服务器:  ${cfg.目标服务器}`);
        console.log(`│  模拟玩家:    ${cfg.模拟玩家数} 人    步骤间隔: ${cfg.步骤间隔}`);
        console.log(`│  并发批次:    ${cfg.并发批次} 人/批`);
        console.log('└────────────────────────────────────────────────────────┘');

        // ── 连接统计 ──
        const conn = r.连接统计;
        const connOk = conn.连接成功;
        const connTotal = conn.计划连接数;
        const loginOk = conn.登录成功;
        console.log('\n┌─ 连接结果 ─────────────────────────────────────────────┐');
        console.log(`│  WebSocket 连接:  ${connOk}/${connTotal} 成功${conn.连接失败 > 0 ? `  (${conn.连接失败} 失败)` : '  ✅'}`,);
        console.log(`│  Session 认证:   ${conn.认证成功} 成功 / ${conn.认证失败} 失败`);
        console.log(`│  角色登录:       ${loginOk} 成功 / ${conn.登录失败} 失败`);
        if (conn.中途断线 > 0) console.log(`│  中途断线:       ${conn.中途断线} 次  ⚠️`);
        console.log(`│  平均连接耗时:   ${conn.平均连接耗时}    平均登录耗时: ${conn.平均登录耗时}`);
        console.log('└────────────────────────────────────────────────────────┘');

        // ── 客户端性能 ──
        const perf = r.客户端性能;
        console.log('\n┌─ 压测客户端自身性能 ──────────────────────────────────┐');
        console.log(`│  总耗时:         ${perf.总耗时}`);
        console.log(`│  CPU 占用:       用户态 ${perf.CPU用户态}    内核态 ${perf.CPU内核态}`);
        console.log(`│  内存:           RSS ${perf.物理内存RSS}    堆 ${perf.堆内存已用} / ${perf.堆内存上限}`);
        const ev = perf.事件循环延迟;
        console.log(`│  事件循环延迟:   平均 ${ev.平均}  P50 ${ev.P50}  P95 ${ev.P95}  P99 ${ev.P99}  最大 ${ev.最大}`);
        console.log('└────────────────────────────────────────────────────────┘');

        // ── 网络 ──
        const net = r.网络通信;
        const rtt = net.往返延迟RTT;
        console.log('\n┌─ 网络通信 ─────────────────────────────────────────────┐');
        if (rtt.样本数 > 0) {
            console.log(`│  往返延迟(RTT):  平均 ${rtt.平均延迟}  P50 ${rtt.P50}  P95 ${rtt.P95}  P99 ${rtt.P99}`);
            console.log(`│                  最大 ${rtt.最大延迟}  (${rtt.样本数} 个样本)`);
        } else {
            console.log(`│  往返延迟(RTT):  无数据（测试期间未收到 ping 响应）`);
        }
        console.log(`│  总流量:         接收 ${net.总接收数据}    发送 ${net.总发送数据}`);
        console.log(`│  人均流量:       接收 ${net.人均接收}    发送 ${net.人均发送}`);
        console.log(`│  峰值速率:       下行 ${net.峰值下行速率}    上行 ${net.峰值上行速率}`);
        console.log(`│  平均速率:       下行 ${net.平均下行速率}    上行 ${net.平均上行速率}`);
        console.log('└────────────────────────────────────────────────────────┘');

        // ── 玩家分布 ──
        const pl = r.玩家分布;
        const famStr = Object.entries(pl.门派).map(([k, v]) => `${k}×${v}`).join('  ');
        const wpnStr = Object.entries(pl.武器).map(([k, v]) => `${k}×${v}`).join('  ');
        console.log('\n┌─ 玩家分布 ─────────────────────────────────────────────┐');
        console.log(`│  门派:  ${famStr}`);
        console.log(`│  武器:  ${wpnStr}`);
        console.log('└────────────────────────────────────────────────────────┘');

        // ── 活动 ──
        const act = r.活动统计;
        console.log('\n┌─ 活动统计 ─────────────────────────────────────────────┐');
        console.log(`│  发送命令:  ${act.发送命令总数} 条    收到消息: ${act.收到消息总数} 条`);
        console.log(`│  人均命令:  ${act.人均发送命令}        人均消息: ${act.人均收到消息}`);
        if (act.错误次数 > 0) {
            console.log(`│  错误:      ${act.错误次数} 次  ⚠️`);
        } else {
            console.log(`│  错误:      ${act.错误次数} 次  ✅`);
        }
        console.log('└────────────────────────────────────────────────────────┘');

        // ── 消息记录（5人以下时显示）──
        if (r.消息记录) {
            for (const p of r.消息记录) {
                console.log(`\n┌─ WS消息: ${p.玩家} (${p.门派}/${p.武器}) ─${'─'.repeat(36)}┐`);
                for (const m of p.消息) {
                    const arrow = m.方向 === '发出' ? '→' : '←';
                    const label = m.方向 === '发出' ? '发' : '收';
                    console.log(`│ ${m.时间} ${arrow} [${label}] ${m.内容.slice(0, 55)}`);
                }
                console.log('└' + '─'.repeat(63) + '┘');
            }
        }

        // ── 健康评估 ──
        console.log('\n┌─ 健康评估 ─────────────────────────────────────────────┐');
        const issues = [];
        if (conn.连接失败 > 0) issues.push(`连接失败 ${conn.连接失败} 次`);
        if (conn.登录失败 > 0) issues.push(`登录失败 ${conn.登录失败} 次`);
        if (conn.中途断线 > 0) issues.push(`中途断线 ${conn.中途断线} 次`);
        if (rtt.样本数 > 0 && parseFloat(rtt.P99) > 100) issues.push(`P99 延迟 ${rtt.P99}（偏高）`);

        if (issues.length === 0) {
            console.log('│  ✅ 所有指标正常，未发现明显问题');
        } else {
            for (const issue of issues) {
                console.log(`│  ⚠️  ${issue}`);
            }
        }
        console.log('└────────────────────────────────────────────────────────┘');

        console.log('\n' + '═'.repeat(64));
        return r;
    }
}

// ============================================================
// 入口
// ============================================================

async function main() {
    // ---- 解析 CLI 参数（可选，覆盖 CONFIG） ----
    const cli = (() => {
        const args = process.argv.slice(2);
        const opts = {};
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '--help') { opts.help = true; continue; }
            if (!args[i].startsWith('--')) continue;
            const key = args[i].substring(2);
            const val = args[i + 1];
            if (val === undefined || val.startsWith('--')) {
                opts[key] = true;
            } else {
                opts[key] = isNaN(Number(val)) ? val : Number(val);
                i++;
            }
        }
        return opts;
    })();

    if (cli.help) {
        console.log(`
wsmud 负载测试模拟器 v3.0

用法:
  node tools/load-test.mjs                       直接跑（使用文件顶部 CONFIG）
  node tools/load-test.mjs --players 100 --duration 60   CLI 覆盖 CONFIG

所有 CLI 参数均可覆盖文件顶部 CONFIG 对应字段:
  --host <addr> --port <port>     服务器地址
  --players <N> --step-delay <ms>    玩家数 & 步骤间隔
  --batch-size <N> --batch-interval <ms>
  --account-prefix <str> --account-start <N> --account-password <pwd>
  --accounts-file <path>          从 JSON 文件加载账号
  --desiv <str> --md5-prefix <str>
  --help                          显示帮助
`);
        process.exit(0);
    }

    // ---- 合并配置: CONFIG（文件顶部）< CLI ----
    // kebab-case (CLI) → camelCase (CONFIG) 自动映射
    const C = (cliKey, fallback) => {
        if (cli[cliKey] !== undefined) return cli[cliKey];
        // batch-size → batchSize, account-prefix → accountPrefix
        const configKey = cliKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        return CONFIG[configKey] ?? fallback;
    };

    const host = C('host', '127.0.0.1');
    const port = C('port', 31300);
    const playerCount = Math.min(5000, Math.max(1, C('players', 10)));
    const batchSize = C('batch-size', 20);
    const batchInterval = C('batch-interval', 100);
    const stepDelay = C('step-delay', 500);

    // 加密参数：CLI → CONFIG → .env
    const desiv = cli.desiv || CONFIG.desiv || readEnv('DESIV');
    const md5Prefix = cli['md5-prefix'] || CONFIG.md5Prefix || readEnv('MD5_PREFIX');

    if (!desiv) {
        console.error('[错误] 缺少 DESIV。请在文件顶部 CONFIG.desiv 中填写，或在 .env 中设置 DESIV');
        process.exit(1);
    }
    if (!md5Prefix) {
        console.error('[错误] 缺少 MD5_PREFIX。请在文件顶部 CONFIG.md5Prefix 中填写，或在 .env 中设置 MD5_PREFIX');
        process.exit(1);
    }

    // ---- 加载账号 ----
    let accounts;
    const accountsFile = C('accounts-file', '');
    if (accountsFile) {
        const absPath = path.resolve(accountsFile);
        if (!fs.existsSync(absPath)) {
            console.error(`[错误] 账号文件不存在: ${absPath}`);
            process.exit(1);
        }
        const data = JSON.parse(fs.readFileSync(absPath, 'utf8'));
        if (!Array.isArray(data)) {
            console.error('[错误] 账号文件格式错误，应为 JSON 数组');
            process.exit(1);
        }
        accounts = data;
    } else {
        const prefix = C('account-prefix', 'testuser');
        const start = C('account-start', 1);
        const pwd = C('account-password', 'test123');
        accounts = [];
        for (let i = 0; i < playerCount; i++) {
            const num = start + i;
            accounts.push({ userId: num, username: `${prefix}${num}`, password: pwd, level: 0 });
        }
        console.log(`[账号] 自动生成 ${accounts.length} 个: ${accounts[0].username} ~ ${accounts[accounts.length - 1].username}`);
    }

    // ---- 启动 ----
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║            wsmud 负载测试模拟器 v3.0                        ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log(`  系统: ${os.type()} ${os.arch()}, ${os.cpus().length} CPU, ${formatBytes(os.totalmem())} RAM`);
    console.log(`  Node: ${process.version}`);

    const engine = new LoadTestEngine({
        players: playerCount,
        host, port,
        batchSize, batchInterval, stepDelay,
        desiv, md5Prefix,
    });

    engine.initPlayers(accounts);
    await engine.run();

    const report = engine.printReport();

    // 保存 JSON 报告
    const reportPath = path.join(__dirname, `load-test-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`\n[报告] ${reportPath}`);
    process.exit(0);
}

main().catch(err => {
    console.error('[致命错误]', err);
    process.exit(1);
});
