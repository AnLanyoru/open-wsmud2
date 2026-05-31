/**
 * WebSocket 服务器 - 监听层
 * 封装网络层并桥接到 WORLD
 */

import { WORLD } from './world.js';
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
  return new Promise((resolve) => {
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
 * 接收消息回调
 */
server.onReceive = function (this: void, msg: string, socket: WsSocket): void {
  WORLD.request(msg, socket);
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
