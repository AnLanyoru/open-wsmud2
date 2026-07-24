/**
 * WebSocket 服务器 - 监听层
 * 封装网络层并桥接到 WORLD
 */

import { WORLD, WS_BATCH_MODE } from './world.js';
import wsServer from './net-ws.js';
import type { WsSocket } from './net-ws.js';

/** WebSocket/TCP 服务器实例 */
const server = new wsServer({
    SSL: false,
    KEY: '',
    CERT: '',
    PASSWORD: '',
});

/**
 * 启动监听
 * @param port - 监听端口
 * @returns Promise，解析于监听启动完成时
 */
server.start = async function (this: wsServer, port: number): Promise<void> {
    return new Promise(resolve => {
        this.listen(port, resolve);
    });
};

/**
 * 新连接建立回调 (WebSocket 握手完成后)
 */
server.onConnect = function (this: void, socket: WsSocket): void {
    WORLD.connect(socket);
};

/**
 * 新 socket 进入回调 (TCP 连接建立时)
 */
server.onSocketIn = function (this: void, socket: WsSocket): void {
    WORLD.SocketIn(socket);
};

/**
 * 接收消息回调 — 入口层批处理开关：
 *   WS_BATCH_MODE=1（默认）入队后分批处理，每批 20ms 让出事件循环
 *   WS_BATCH_MODE=0   同步模式：直接调用 WORLD.request，指令即时处理
 *   与 BATCH_MODE 解耦：BATCH_MODE 控制房间层（socket.write 合并），
 *   WS_BATCH_MODE 控制入口层（指令调度）。
 *   组合 BATCH_MODE=1 + WS_BATCH_MODE=0 即"混合模式"：
 *     指令同步执行 → 消息立即入房间 _batch_all_payloads → 0-16ms 后 _flush_batch 合并推送。
 */

const _msgQueue: Array<[string, WsSocket]> = [];
let _msgIndex = 0;
let _msgScheduled = false;
const _MSG_TIMESLICE_MS = 20;
/** 队列长度上限，超过后降级为同步处理，防止内存溢出 */
const _MSG_QUEUE_LIMIT = 10000;

function _processMsgBatch(): void {
    _msgScheduled = false;
    const t0 = Date.now();
    while (_msgIndex < _msgQueue.length) {
        const entry = _msgQueue[_msgIndex];
        _msgIndex++;
        WORLD.request(entry[0], entry[1]);
        if (WS_BATCH_MODE === 1 && Date.now() - t0 >= _MSG_TIMESLICE_MS) break;
    }
    if (_msgIndex < _msgQueue.length) {
        _msgScheduled = true;
        setImmediate(_processMsgBatch);
    } else {
        _msgQueue.length = 0;
        _msgIndex = 0;
    }
}

server.onReceive = function (this: void, msg: string, socket: WsSocket): void {
    if (WS_BATCH_MODE === 0) {
        // 入口同步：直接处理，不排队不分批
        WORLD.request(msg, socket);
        return;
    }
    // 背压保护：队列超限时降级为同步处理，避免内存无限增长
    if (_msgQueue.length - _msgIndex >= _MSG_QUEUE_LIMIT) {
        WORLD.request(msg, socket);
        return;
    }
    _msgQueue.push([msg, socket]);
    if (!_msgScheduled) {
        _msgScheduled = true;
        setImmediate(_processMsgBatch);
    }
};

/**
 * 服务器关闭回调
 */
server.onClose = function (this: void): void {
    console.log('server closed');
};

/**
 * 客户端断开回调
 */
server.onClientClose = function (this: void, socket: WsSocket, _e?: Error): void {
    WORLD.disconnect(socket);
    if (!socket.destroyed) {
        socket.destroy();
    }
};

/**
 * 客户端超时回调
 * 仅断开无用户（或未登录）的连接
 */
server.onClientTimeout = function (this: void, socket: WsSocket, _e?: Error): void {
    if (socket && (!socket.user || !socket.user.id)) {
        socket.end();
    }
};

/**
 * 客户端错误回调
 */
server.onClientError = function (this: void, socket: WsSocket, _e?: Error): void {
    if (socket && socket.user) {
        if (!socket.destroyed) {
            socket.destroy();
        }
    }
};

export default server;
