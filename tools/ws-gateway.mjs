#!/usr/bin/env node
/**
 * WS 虚拟网关 — 转发客户端与游戏服务器之间的流量，统计吞吐
 *
 * 用法:
 *   node tools/ws-gateway.mjs [--port 31301] [--target ws://127.0.0.1:31300]
 */

import { WebSocketServer } from 'ws';
import net from 'net';
import crypto from 'crypto';
import { performance } from 'perf_hooks';

// ============================================================
const CONFIG = {
    port: 31301,              // 网关监听端口（客户端连这里）
    target: 'ws://127.0.0.1:31300',  // 上游游戏服务器
    printInterval: 5000,      // 统计打印间隔 ms
};

// ============================================================
// 统计
// ============================================================
const stats = {
    clients: 0,
    totalIn: 0,    // 客户端→服务器
    totalOut: 0,   // 服务器→客户端
    startTime: 0,
};

function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

let lastIn = 0, lastOut = 0;
function printStats() {
    const elapsed = Math.max(1, Math.round((performance.now() - stats.startTime) / 1000));
    const inRate = Math.round((stats.totalIn - lastIn) / 5);
    const outRate = Math.round((stats.totalOut - lastOut) / 5);
    lastIn = stats.totalIn;
    lastOut = stats.totalOut;
    console.log(`[GW ${elapsed}s] 连接:${stats.clients} | 实时 入 ${formatBytes(inRate)}/s  出 ${formatBytes(outRate)}/s | 累计 入 ${formatBytes(stats.totalIn)}  出 ${formatBytes(stats.totalOut)}`);
}

// ============================================================
// WebSocket 协议工具（RFC 6455，与 server/core/net-ws.ts var1 一致）
// ============================================================

/**
 * 生成随机 WebSocket 密钥（16 字节 base64）
 */
function generateWsKey() {
    return crypto.randomBytes(16).toString('base64');
}

/**
 * 创建带 mask 的 WebSocket 文本帧（客户端→服务器必须带 mask）
 */
function createMaskedFrame(data) {
    const payload = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
    const len = payload.length;
    const maskKey = crypto.randomBytes(4);

    let header;
    let maskOffset;
    if (len < 126) {
        header = Buffer.alloc(2 + 4);
        header[0] = 0x81;          // FIN + Text opcode
        header[1] = 0x80 | len;    // MASK + payload length
        maskOffset = 2;
    } else if (len < 65536) {
        header = Buffer.alloc(4 + 4);
        header[0] = 0x81;
        header[1] = 0x80 | 126;
        header.writeUInt16BE(len, 2);
        maskOffset = 4;
    } else {
        header = Buffer.alloc(10 + 4);
        header[0] = 0x81;
        header[1] = 0x80 | 127;
        header.writeUInt32BE(0, 2);
        header.writeUInt32BE(len, 6);
        maskOffset = 10;
    }
    maskKey.copy(header, maskOffset);

    // XOR payload
    const masked = Buffer.alloc(len);
    for (let i = 0; i < len; i++) {
        masked[i] = payload[i] ^ maskKey[i % 4];
    }

    return Buffer.concat([header, masked]);
}

/**
 * 解析非 mask 的 WebSocket 帧（服务器→客户端不带 mask）
 * @returns {{ opcode: number, payload: Buffer, consumed: number } | null}
 */
function parseUnmaskedFrame(buffer) {
    if (buffer.length < 2) return null;

    const opcode = buffer[0] & 0x0f;
    let length = buffer[1] & 0x7f;
    let offset = 2;

    if (length === 126) {
        if (buffer.length < 4) return null;
        length = buffer.readUInt16BE(2);
        offset = 4;
    } else if (length === 127) {
        if (buffer.length < 10) return null;
        // 仅取低 32 位，拒绝 > 10MB
        const low = buffer.readUInt32BE(6);
        if (buffer.readUInt32BE(2) > 0 || low > 10 * 1024 * 1024) return null;
        length = low;
        offset = 10;
    }

    if (buffer.length < offset + length) return null;

    return {
        opcode,
        payload: buffer.subarray(offset, offset + length),
        consumed: offset + length,
    };
}

// ============================================================
// 代理单条连接
// ============================================================
function proxyConnection(clientWs) {
    stats.clients++;
    const target = new URL(CONFIG.target);
    const serverSocket = net.createConnection({ host: target.hostname, port: parseInt(target.port) || 31300 });

    const clientBuffer = [];   // 握手完成前缓存客户端消息
    let handshakeDone = false;
    let closed = false;
    let leftover = Buffer.alloc(0);  // 服务器 TCP 数据未读完的字节

    function cleanup() {
        if (closed) return;
        closed = true;
        stats.clients--;
        try { clientWs.close(); } catch (_) { }
        try { serverSocket.destroy(); } catch (_) { }
    }

    // ---- WebSocket 握手：网关 → 游戏服务器 ----
    const wsKey = generateWsKey();
    const upgradeReq = [
        `GET / HTTP/1.1`,
        `Host: ${target.hostname}:${target.port || 31300}`,
        `Upgrade: WebSocket`,
        `Connection: Upgrade`,
        `Sec-WebSocket-Key: ${wsKey}`,
        `Sec-WebSocket-Version: 13`,
        `Origin: ws://${target.hostname}:${target.port || 31300}`,
        ``,
        ``,
    ].join('\r\n');

    serverSocket.write(upgradeReq);

    // ---- 解析握手响应 ----
    let handshakeBuf = Buffer.alloc(0);
    serverSocket.on('data', function onData(chunk) {
        if (!handshakeDone) {
            handshakeBuf = Buffer.concat([handshakeBuf, chunk], handshakeBuf.length + chunk.length);
            const endIdx = handshakeBuf.indexOf('\r\n\r\n');
            if (endIdx === -1) return; // 还没收完响应头

            // 解析响应头
            const headerPart = handshakeBuf.toString('utf8', 0, endIdx);
            const lines = headerPart.split('\r\n');
            const statusLine = lines[0];
            if (!statusLine || !statusLine.startsWith('HTTP/1.1 101')) {
                console.log(`  [GW] 握手失败: ${statusLine}`);
                cleanup();
                return;
            }

            // 验证 Sec-WebSocket-Accept
            const headers = {};
            for (let i = 1; i < lines.length; i++) {
                const colonIdx = lines[i].indexOf(':');
                if (colonIdx > 0) {
                    headers[lines[i].substring(0, colonIdx).trim()] = lines[i].substring(colonIdx + 1).trim();
                }
            }
            const expectedAccept = crypto.createHash('sha1')
                .update(wsKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
                .digest('base64');
            if (headers['Sec-WebSocket-Accept'] !== expectedAccept) {
                console.log(`  [GW] Accept 密钥不匹配`);
                cleanup();
                return;
            }

            handshakeDone = true;
            console.log(`  [GW] 握手完成，开始代理`);

            // 转发握手期间缓存的消息
            for (const d of clientBuffer) {
                const frame = createMaskedFrame(d);
                stats.totalIn += frame.length;
                serverSocket.write(frame);
            }
            clientBuffer.length = 0;

            // 处理握手响应后的剩余数据（可能包含帧数据）
            const trailer = handshakeBuf.subarray(endIdx + 4);
            if (trailer.length > 0) {
                leftover = trailer;
                processFrames();
            }

            // 替换 onData：后续数据直接走帧解析
            serverSocket.removeListener('data', onData);
            serverSocket.on('data', (chunk) => {
                stats.totalOut += chunk.length;
                leftover = leftover.length > 0
                    ? Buffer.concat([leftover, chunk], leftover.length + chunk.length)
                    : chunk;
                processFrames();
            });
        }
    });

    /**
     * 解析服务器→客户端的 WebSocket 帧并转发
     */
    function processFrames() {
        while (true) {
            const frame = parseUnmaskedFrame(leftover);
            if (!frame) break; // 帧不完整，等待更多数据

            switch (frame.opcode) {
                case 0x1: // Text
                    try { clientWs.send(frame.payload.toString('utf8')); } catch (_) { }
                    break;
                case 0x8: // Close
                    cleanup();
                    return;
                case 0x9: // Ping → 回复 Pong
                    try { clientWs.ping(frame.payload); } catch (_) { }
                    break;
                // Pong(0xA) / Binary(0x2) 忽略
            }
            leftover = leftover.subarray(frame.consumed);
        }
    }

    // ---- 客户端→服务器：转发 ----
    clientWs.on('message', (data) => {
        if (handshakeDone) {
            const frame = createMaskedFrame(data);
            stats.totalIn += frame.length;
            serverSocket.write(frame);
        } else {
            clientBuffer.push(data);
        }
    });

    // ---- 清理 ----
    serverSocket.on('error', (err) => {
        console.log(`  [GW] 上游连接失败: ${err.message}`);
        cleanup();
    });

    clientWs.on('close', cleanup);
    serverSocket.on('close', cleanup);
    clientWs.on('error', (err) => {
        console.log(`  [GW] 客户端错误: ${err.message}`);
    });
}

// ============================================================
// 启动
// ============================================================
const args = process.argv.slice(2);
const opts = {};
for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith('--')) continue;
    const key = args[i].substring(2);
    const val = args[i + 1];
    opts[key] = (val && !val.startsWith('--')) ? (isNaN(+val) ? val : +val) : true;
    if (val && !val.startsWith('--')) i++;
}

const port = opts.port || CONFIG.port;
const target = opts.target || CONFIG.target;

console.log(`WS网关: 0.0.0.0:${port} → ${target}`);
console.log(`每 ${CONFIG.printInterval / 1000}s 打印吞吐统计\n`);

const wss = new WebSocketServer({ port });
stats.startTime = performance.now();

wss.on('connection', proxyConnection);

setInterval(printStats, CONFIG.printInterval);

// 优雅退出
process.on('SIGINT', () => {
    console.log('\n[网关] 关闭...');
    printStats();
    wss.close();
    process.exit(0);
});
