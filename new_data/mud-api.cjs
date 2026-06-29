/**
 * MUD Game API — 无前端纯 API
 *
 * 启动后自动登录正式服、选取第一个角色进入游戏。
 * 通过 POST /api/cmd 发送命令，模拟前端 SendCommand，收集 WS 返回。
 *
 * 启动: node scripts/mud-api.cjs
 * 端口: 3099
 */

const http = require('http');
const { WebSocket } = require('ws');

// ============ 配置 ============
const API_PORT = 3099;
const ACCOUNT = { code: 'shiqiua', pwd: 'shiqiua' };
const PROD_SERVER_ID = 10; // 五区

const API_HOST = 'www.wsmud2.com';
const GAME_ORIGIN = 'http://www.wsmud2.com';

// 命令发送后静默多少毫秒视为响应完毕
const QUIET_MS = 1500;
// 最长等待
const MAX_WAIT_MS = 15000;

// ============ 状态 ============
let gameWs = null;
let currentPlayer = null;
let activeCollector = null;

// ============ 工具函数 ============
function post(hostname, port, path, body) {
    return new Promise((resolve, reject) => {
        const data = typeof body === 'string' ? body : JSON.stringify(body);
        const req = http.request({
            hostname, port, path, method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
                'Host': hostname,
            },
        }, (res) => {
            let b = '';
            res.on('data', (c) => b += c);
            res.on('end', () => {
                try { resolve(JSON.parse(b)); }
                catch (e) { reject(new Error('JSON 解析失败: ' + b.substring(0, 100))); }
            });
        });
        req.on('error', reject);
        req.setTimeout(15000, () => { req.destroy(); reject(new Error('请求超时')); });
        req.write(data);
        req.end();
    });
}

function get(hostname, port, path) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname, port, path, method: 'GET',
            headers: { 'Host': hostname, 'Accept': 'application/json' },
        }, (res) => {
            let b = '';
            res.on('data', (c) => b += c);
            res.on('end', () => {
                try { resolve(JSON.parse(b)); }
                catch (e) { reject(new Error('JSON 解析失败')); }
            });
        });
        req.on('error', reject);
        req.setTimeout(15000, () => { req.destroy(); reject(new Error('请求超时')); });
        req.end();
    });
}

// ============ 自动登录流程 ============
async function autoLogin() {
    console.log('1. 获取服务器列表...');
    const servers = await get(API_HOST, 80, '/api/game/servers');
    const server = servers.find((s) => s.id === PROD_SERVER_ID);
    if (!server) throw new Error('找不到正式服(五区)');
    console.log('   正式服: ' + server.name + ' ' + server.ip + ':' + server.port);

    console.log('2. HTTP 登录...');
    const session = await post(API_HOST, 80, '/api/user/login', ACCOUNT);
    if (session.code !== 1) throw new Error('登录失败: ' + (session.result || '未知错误'));
    const sessionKey = session.u;
    const sessionToken = session.p;
    console.log('   登录成功');

    console.log('3. 连接游戏服务器...');
    // 必须在 open 回调里立刻发送 auth，否则 3 秒超时会被服务器断开
    const authMsg = sessionKey + ' ' + sessionToken;
    const roles = await new Promise((resolve, reject) => {
        const ws = new WebSocket('ws://' + server.ip + ':' + server.port, {
            headers: {
                'Origin': GAME_ORIGIN,
                'User-Agent': 'Mozilla/5.0',
            },
            handshakeTimeout: 10000,
        });

        ws.on('open', () => {
            ws.send(authMsg);
        });

        ws.on('message', (data) => {
            const msg = data.toString();
            // 服务器返回的 JSON 可能用单引号，用 Function 解析
            let obj;
            try { obj = JSON.parse(msg); }
            catch (e1) {
                try { obj = new Function('return ' + msg + ';')(); }
                catch (e2) { return; }
            }
            if (obj.type === 'roles') {
                gameWs = ws;
                resolve(obj.roles);
            } else if (obj.type === 'loginerror') {
                reject(new Error(obj.msg || '认证失败'));
            }
        });

        ws.on('error', (err) => reject(new Error('WS 连接错误: ' + err.message)));
        ws.on('close', () => {
            if (!gameWs) reject(new Error('游戏服务器关闭了连接（可能维护中）'));
        });

        setTimeout(() => reject(new Error('连接认证超时')), 12000);
    });

    console.log('   角色列表: ' + roles.map((r) => r.name + '(' + r.title + ')').join(', '));

    // 替换消息处理器：之后所有消息走 collector 机制
    gameWs.removeAllListeners('message');
    gameWs.on('message', (data) => {
        const msg = data.toString();
        let parsed;
        if (msg[0] === '{' || msg[0] === '[') {
            try { parsed = JSON.parse(msg); }
            catch (e1) {
                try { parsed = new Function('return ' + msg + ';')(); }
                catch (e2) { parsed = msg; }
            }
        } else {
            parsed = msg;
        }

        if (activeCollector) {
            activeCollector.messages.push(parsed);
            clearTimeout(activeCollector.quietTimer);
            activeCollector.quietTimer = setTimeout(() => {
                activeCollector.resolve();
                activeCollector = null;
            }, activeCollector.quietMs);
        }
    });

    gameWs.on('close', () => {
        console.log('游戏服务器连接断开');
        gameWs = null;
        currentPlayer = null;
        if (activeCollector) { activeCollector.resolve(); activeCollector = null; }
    });

    gameWs.on('error', () => {});

    // 选第一个角色
    const firstRole = roles[0];
    console.log('4. 选择角色: ' + firstRole.name + ' (' + firstRole.id + ')');

    const loginResult = await sendAndCollect('login ' + firstRole.id, QUIET_MS, MAX_WAIT_MS);

    const loginMsg = loginResult.find((m) => {
        if (typeof m === 'string') return false;
        return m.type === 'login';
    });
    if (!loginMsg) {
        const errMsg = loginResult.find((m) => typeof m !== 'string' && m.type === 'loginerror');
        throw new Error('进入游戏失败: ' + (errMsg ? errMsg.msg : '未知错误'));
    }

    currentPlayer = { id: loginMsg.id, name: firstRole.name, level: loginMsg.level || 0 };
    console.log('   进入游戏成功！玩家: ' + currentPlayer.name + ' Lv.' + currentPlayer.level);
}

// ============ 命令发送 ============
function sendAndCollect(cmd, quietMs, maxWaitMs) {
    return new Promise((resolve, reject) => {
        if (activeCollector) {
            activeCollector.resolve();
            activeCollector = null;
        }

        const collector = {
            messages: [],
            quietMs: quietMs,
            quietTimer: null,
            maxTimer: null,
            resolve: null,
            reject: null,
        };

        collector.resolve = () => {
            clearTimeout(collector.quietTimer);
            clearTimeout(collector.maxTimer);
            if (activeCollector === collector) activeCollector = null;
            resolve(collector.messages);
        };
        collector.reject = (err) => {
            clearTimeout(collector.quietTimer);
            clearTimeout(collector.maxTimer);
            if (activeCollector === collector) activeCollector = null;
            reject(err);
        };

        collector.maxTimer = setTimeout(() => collector.resolve(), maxWaitMs);
        activeCollector = collector;

        try {
            gameWs.send(cmd);
        } catch (err) {
            activeCollector = null;
            reject(err);
            return;
        }

        collector.quietTimer = setTimeout(() => {
            if (activeCollector === collector) collector.resolve();
        }, quietMs);
    });
}

// ============ HTTP API ============
function jsonResp(res, code, obj) {
    res.writeHead(code, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
        res.end();
        return;
    }

    const urlPath = req.url.split('?')[0];

    // POST /api/cmd — 发送命令
    if (req.method === 'POST' && urlPath === '/api/cmd') {
        let body = '';
        req.on('data', (c) => body += c);
        req.on('end', async () => {
            let params;
            try { params = JSON.parse(body || '{}'); } catch (e) {
                return jsonResp(res, 400, { ok: false, error: 'JSON 解析失败' });
            }

            const cmd = (params.cmd || '').trim();
            if (!cmd) return jsonResp(res, 400, { ok: false, error: '缺少 cmd' });
            if (!gameWs || gameWs.readyState !== WebSocket.OPEN) {
                return jsonResp(res, 503, { ok: false, error: '未连接游戏服务器' });
            }

            const quietMs = params.quietMs || QUIET_MS;
            const maxWaitMs = Math.min(params.timeout || MAX_WAIT_MS, 30000);

            try {
                const t0 = Date.now();
                const messages = await sendAndCollect(cmd, quietMs, maxWaitMs);
                const elapsed = Date.now() - t0;

                const textMessages = [];
                const jsonMessages = [];
                for (const m of messages) {
                    if (typeof m === 'string') textMessages.push(m);
                    else jsonMessages.push(m);
                }

                jsonResp(res, 200, {
                    ok: true, cmd, elapsed, count: messages.length,
                    messages: textMessages,
                    json: jsonMessages,
                });
            } catch (err) {
                jsonResp(res, 500, { ok: false, error: err.message });
            }
        });
        return;
    }

    // GET /api/status
    if (req.method === 'GET' && urlPath === '/api/status') {
        jsonResp(res, 200, {
            ok: true,
            connected: !!(gameWs && gameWs.readyState === WebSocket.OPEN),
            player: currentPlayer,
        });
        return;
    }

    // 根路径
    if (urlPath === '/' || urlPath === '') {
        jsonResp(res, 200, {
            name: 'MUD API',
            endpoints: {
                'POST /api/cmd': '发送游戏命令 {cmd, quietMs?, timeout?}',
                'GET /api/status': '查看连接状态',
            },
            account: ACCOUNT.code,
            player: currentPlayer,
        });
        return;
    }

    jsonResp(res, 404, { ok: false, error: '未知端点' });
});

// ============ 启动 ============
async function start() {
    try {
        await autoLogin();
    } catch (err) {
        console.error('自动登录失败: ' + err.message);
        console.error('API 仍会启动，但需手动重启。');
    }

    server.listen(API_PORT, () => {
        console.log('');
        console.log('══════════════════════════════════════');
        console.log('  MUD API 已启动');
        console.log('  http://localhost:' + API_PORT);
        console.log('  POST /api/cmd  {"cmd":"look"}');
        console.log('══════════════════════════════════════');
    });
}

start().catch((err) => {
    console.error('启动失败:', err.message);
    process.exit(1);
});
