#!/usr/bin/env node
/**
 * wsmud 负载测试模拟器 v4.0
 *
 * 持续压力测试：不断从预制流程池中随机抽取流程执行，定时采集服务端 /metrics。
 * 客户端自身性能数据不再测量。
 *
 * 用法:
 *   1. 修改文件顶部 CONFIG 对象（服务器、玩家数、账号等）
 *   2. node tools/load-test.mjs
 *   3. 也可用 CLI 参数临时覆盖: node tools/load-test.mjs --players 100
 *
 * 前置条件:
 *   - 游戏服务器已启动（默认 ws://127.0.0.1:31300）
 *   - CONFIG 中填写 desiv 和 md5Prefix，或留空自动从 .env 读取
 */

import { performance } from 'perf_hooks';
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
 * 预置流程池 — 指令用 ; 分割即为多步流程，玩家随机抽取并逐步执行。
 * 走完一组自动抽下一组，永不停歇。
 */
const COMMAND_POOL = [
    ['jh fam 5 start;go east;go north', { weight: 5 }],
    ['jh fam 4 start;go west;go south;go west;go west', { weight: 5 }],
    ['jh fam 3 start;go westup;go north;go north;go east', { weight: 3 }],
    ['jh fam 2 start;go north;go west', { weight: 2 }],
    ['jh fam 2 start;go north;go east', { weight: 2 }],
    ['jh fam 1 start;go west;go west', { weight: 5 }],
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

// ============================================================
// ⚙️  配置 —— 直接改这里就能跑，无需命令行参数
// ============================================================
const CONFIG = {
    // ---- 服务器 ----
    host: '127.0.0.1',
    port: 31300,           // 连网关，不直连游戏服务器

    // ---- 测试参数 ----
    players: 1000,           // 模拟玩家数
    batchSize: 20,        // 每批并发连接数
    batchInterval: 100,   // 批次间隔（毫秒）
    stepDelay: 500,       // 流程步骤间隔（毫秒）
    duration: 0,          // 测试持续时间（秒），0 = 持续到 Ctrl+C
    metricsOutput: '',    // 测试结束时把 /metrics 写到该文件

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
        this.desiv = typeof desiv === 'string' ? Buffer.from(desiv, 'utf8') : desiv;
        this.md5Prefix = md5Prefix;
    }

    /**
     * 计算服务端 MD5(password + md5Prefix)
     */
    hashPassword(password) {
        return crypto.createHash('md5')
            .update(password + this.md5Prefix)
            .digest('hex')
            .toUpperCase();
    }

    /**
     * AES-128-CBC 加密
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
     */
    generateToken(userId, username, password, level = 0) {
        const pwdMD5 = this.hashPassword(password);
        const sessionKey = crypto.randomBytes(8).toString('hex');
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
        this.connected = false;

        // 统计（仅操作计数，不做性能测量）
        this.commandsSent = 0;
        this.errors = 0;

        // 流程状态
        this.flow = null;
        this.flowStep = 0;
    }

    /** 获取下一步指令：流程走完自动抽新流程，永远返回有效指令 */
    nextCommand() {
        if (!this.flow || this.flowStep >= this.flow.length) {
            this.flow = randChoice(WEIGHTED_FLOWS);
            this.flowStep = 0;
        }
        return this.flow[this.flowStep++];
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
        this.duration = options.duration || 0;
        this.metricsOutput = options.metricsOutput || '';

        this.sessionGen = new SessionGenerator(options.desiv, options.md5Prefix);

        this.players = [];
        this.running = false;
        this._ending = false;
        this._startTime = 0;

        // 仅保留操作级统计
        this.stats = {
            connects: 0,
            connectFails: 0,
            disconnects: 0,
            totalCommands: 0,
            errors: 0,
        };
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

        this.running = true;
        this._startTime = performance.now();

        // ---- 第1步: 批量连接 + 认证 ----
        console.log(`\n[步骤1] 连接 WebSocket 并认证...`);
        await this._batchConnect(wsUrl);

        const connected = this.players.filter(p => p.connected).length;
        console.log(`[结果] 连接=${connected} 失败=${this.stats.connectFails}`);

        if (connected === 0) {
            console.error('[错误] 无玩家成功连接，退出测试');
            this.running = false;
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

        // ---- 第3步: 持续压力测试 ----
        // 每个玩家不断从流程池抽取流程逐步执行，走完自动抽下一组
        console.log(`\n[步骤3] 持续压力测试 — 不断抽取预制流程执行（Ctrl+C 停止）...`);
        console.log('-'.repeat(70));

        const metricsUrl = `http://127.0.0.1:${this.port + 1}/metrics`;
        let round = 0;

        // 命令发送定时器：每步所有在线玩家各发一条指令
        const cmdTimer = setInterval(() => {
            round++;
            for (const p of this.players) {
                if (p.socket?.readyState === WebSocket.OPEN) {
                    this._sendFlowCommand(p);
                }
            }
        }, this.stepDelay);

        // metrics 采集定时器：每 5 步采集一次服务端指标
        const metricsTimer = setInterval(async () => {
            try {
                const m = await fetch(metricsUrl).then(r => r.json());
                const elapsed = Math.round((performance.now() - this._startTime) / 1000);
                const online = this.players.filter(p => p.socket?.readyState === WebSocket.OPEN).length;
                console.log(
                    `  [${elapsed}s 轮次:${round}] ` +
                    `在线:${online} 房间:${m.runRooms} ` +
                    `evP95=${m.evLoopP95}ms hb=${m.lastHbCost}ms flush=${m.lastFlushCost}ms ` +
                    `itemBc=${m.itemChangedBroadcasts} ` +
                    `命令:${this.stats.totalCommands} 错误:${this.stats.errors}`
                );
            } catch (_) { /* metrics 端点暂不可用则跳过 */ }
        }, this.stepDelay * 5);

        // 等待 Ctrl+C 或 duration 超时
        await new Promise(r => {
            const onSig = () => {
                process.removeListener('SIGINT', onSig);
                clearInterval(cmdTimer);
                clearInterval(metricsTimer);
                r();
            };
            process.on('SIGINT', onSig);

            if (this.duration > 0) {
                setTimeout(() => {
                    process.removeListener('SIGINT', onSig);
                    clearInterval(cmdTimer);
                    clearInterval(metricsTimer);
                    console.log(`\n[超时] duration=${this.duration}s 已到，停止测试`);
                    r();
                }, this.duration * 1000);
            }
        });

        // ---- 采集最终 metrics ----
        if (this.metricsOutput) {
            try {
                const m = await fetch(metricsUrl).then(r => r.json());
                fs.writeFileSync(this.metricsOutput, JSON.stringify(m, null, 2), 'utf8');
                console.log(`[metrics] 已保存到 ${this.metricsOutput}`);
            } catch (e) {
                console.error(`[metrics] 采集失败: ${e.message}`);
            }
        }

        // ---- 断开 ----
        console.log('\n[断开] 关闭所有连接...');
        this._ending = true;
        for (const p of this.players) {
            if (p.socket) {
                try { p.socket.close(); } catch (_) { /* ignore */ }
            }
        }
        await new Promise(r => setTimeout(r, 500));
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
                    this.stats.connects++;

                    const token = this.sessionGen.generateToken(
                        player.userId, player.username, player.password, player.level,
                    );
                    ws.send(`${token.sessionKey} ${token.cert}`);
                    clearTimeout(timeout);
                    resolve(true);
                });

                ws.on('message', () => {});  // 忽略消息

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

    // ============================================================
    // 发送命令
    // ============================================================

    /** 发送字符串到玩家 socket */
    _send(player, data) {
        player.socket.send(data);
    }

    /** 发送玩家当前流程的下一步指令（走完自动抽新流程） */
    _sendFlowCommand(player) {
        const cmd = player.nextCommand();
        try {
            player.socket.send(cmd);
            player.commandsSent++;
            this.stats.totalCommands++;
        } catch (_) {
            this.stats.errors++;
            player.errors++;
        }
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
        const elapsed = ((performance.now() - this._startTime) / 1000).toFixed(1);

        // 门派/武器分布
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
            测试结果: {
                总耗时: elapsed + '秒',
                发送命令总数: this.stats.totalCommands,
                错误次数: this.stats.errors,
            },
            连接统计: {
                连接成功: this.stats.connects,
                连接失败: this.stats.connectFails,
                中途断线: this.stats.disconnects,
            },
            玩家分布: {
                门派: familiesCN,
                武器: weaponsCN,
            },
        };
    }

    printReport() {
        const r = this.generateReport();
        const cfg = r.测试配置;
        const res = r.测试结果;
        const conn = r.连接统计;
        const dist = r.玩家分布;

        console.log('\n' + '═'.repeat(56));
        console.log('               ⚔️  负载测试报告  ⚔️');
        console.log('═'.repeat(56));

        console.log(`\n  目标:  ${cfg.目标服务器}    玩家: ${cfg.模拟玩家数} 人`);
        console.log(`  耗时:  ${res.总耗时}    命令: ${res.发送命令总数} 条    错误: ${res.错误次数}`);

        const connStr = conn.连接失败 > 0
            ? `连接 ${conn.连接成功} / 失败 ${conn.连接失败} / 断线 ${conn.中途断线}  ⚠️`
            : `连接 ${conn.连接成功} / 失败 ${conn.连接失败} / 断线 ${conn.中途断线}  ✅`;
        console.log(`  ${connStr}`);

        const famStr = Object.entries(dist.门派).map(([k, v]) => `${k}×${v}`).join('  ');
        const wpnStr = Object.entries(dist.武器).map(([k, v]) => `${k}×${v}`).join('  ');
        console.log(`  门派:  ${famStr}`);
        console.log(`  武器:  ${wpnStr}`);

        console.log('\n' + '═'.repeat(56));
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
wsmud 负载测试模拟器 v4.0

持续压力测试：不断从预制流程池随机抽取流程执行，定时采集服务端 /metrics。
客户端自身性能数据不再测量。

用法:
  node tools/load-test.mjs                       直接跑（使用文件顶部 CONFIG）
  node tools/load-test.mjs --players 100          CLI 覆盖 CONFIG

所有 CLI 参数均可覆盖文件顶部 CONFIG 对应字段:
  --host <addr> --port <port>            服务器地址
  --players <N> --step-delay <ms>        玩家数 & 步骤间隔
  --batch-size <N> --batch-interval <ms>
  --duration <秒>                        持续 N 秒后自动停止（默认 0 = 持续到 Ctrl+C）
  --metrics-output <path>                测试结束时把 /metrics 写到该文件
  --account-prefix <str> --account-start <N> --account-password <pwd>
  --accounts-file <path>                 从 JSON 文件加载账号
  --desiv <str> --md5-prefix <str>
  --help                                 显示帮助
`);
        process.exit(0);
    }

    // ---- 合并配置: CONFIG（文件顶部）< CLI ----
    const C = (cliKey, fallback) => {
        if (cli[cliKey] !== undefined) return cli[cliKey];
        const configKey = cliKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        return CONFIG[configKey] ?? fallback;
    };

    const host = C('host', '127.0.0.1');
    const port = C('port', 31300);
    const playerCount = Math.min(5000, Math.max(1, C('players', 10)));
    const batchSize = C('batch-size', 20);
    const batchInterval = C('batch-interval', 100);
    const stepDelay = C('step-delay', 500);
    const duration = C('duration', 0);
    const metricsOutput = C('metrics-output', '');

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
    console.log('║            wsmud 负载测试模拟器 v4.0                        ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log(`  系统: ${os.type()} ${os.arch()}, ${os.cpus().length} CPU, ${formatBytes(os.totalmem())} RAM`);
    console.log(`  Node: ${process.version}`);

    const engine = new LoadTestEngine({
        players: playerCount,
        host, port,
        batchSize, batchInterval, stepDelay,
        duration, metricsOutput,
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
