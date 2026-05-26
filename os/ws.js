
const ws = require("./net-ws");
const server = new ws({
    SSL: false,
    KEY: "",
    CERT: "",
    PASSWORD: ""
});
server.start = async function (port) {
    return new Promise((resolve) => {
        this.listen(port, resolve);
    });
}
// WORLD.LISTENER = server;
server.onConnect = function (socket) {
    WORLD.connect(socket);
}
server.onSocketIn = function (socket) {

    WORLD.SocketIn(socket);

}
server.onReceive = function (msg, socket) {
    WORLD.request(msg, socket);
}
server.onClose = function (msg, socket) {
    console.log("server closed");
}
server.onClientClose = function (socket, e) {

    WORLD.disconnect(socket);
    if (!socket.destroyed) {
        socket.destroy();
    }
}
server.onClientTimeout = function (socket, e) {
    if (socket && (!socket.user || !socket.user.id)) {
        socket.end();
    }
}
server.onClientError = function (socket, e) {
    if (socket && socket.user) {
        if (!socket.destroyed) {
            socket.destroy();
        }
    }
}

module.exports = server;
