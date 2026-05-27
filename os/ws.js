/**
 * WebSocket 服务器 - 监听层
 * 封装网络层并桥接到WORLD
 */

const ws = require("./net-ws");

/** @type {wsServer} */
const server = new ws({
    SSL: false,
    KEY: "",
    CERT: "",
    PASSWORD: ""
});

/**
 * 启动监听
 * @param {number} port - 监听端口
 * @returns {Promise<void>}
 */
server.start = async function (port) {
    return new Promise((resolve) => {
        this.listen(port, resolve);
    });
}

/**
 * 新连接回调
 * @param {*} socket
 */
server.onConnect = function (socket) {
    WORLD.connect(socket);
}

/**
 * 新socket进入回调
 * @param {*} socket
 */
server.onSocketIn = function (socket) {

    WORLD.SocketIn(socket);

}

/**
 * 接收消息回调
 * @param {string} msg
 * @param {*} socket
 */
server.onReceive = function (msg, socket) {
    WORLD.request(msg, socket);
}

/**
 * 服务器关闭回调
 */
server.onClose = function (msg, socket) {
    console.log("server closed");
}

/**
 * 客户端断开回调
 * @param {*} socket
 * @param {*} e
 */
server.onClientClose = function (socket, e) {

    WORLD.disconnect(socket);
    if (!socket.destroyed) {
        socket.destroy();
    }
}

/**
 * 客户端超时回调
 * @param {*} socket
 * @param {*} e
 */
server.onClientTimeout = function (socket, e) {
    if (socket && (!socket.user || !socket.user.id)) {
        socket.end();
    }
}

/**
 * 客户端错误回调
 * @param {*} socket
 * @param {*} e
 */
server.onClientError = function (socket, e) {
    if (socket && socket.user) {
        if (!socket.destroyed) {
            socket.destroy();
        }
    }
}

module.exports = server;
