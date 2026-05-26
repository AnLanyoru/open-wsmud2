"use strict";
var crypto = require('crypto');
var fs = require("fs");
function wsServer(options) {
    var evt = ["Close", "Error", "SocketIn", "Connect", "Receive",
        "ClientError", "ClientClose", "ClientTimeout"];
    for (var i = 0; i < evt.length; i++) {
        this["on" + evt[i]] = function () {
        }
    }
    this.options = options.SSL ? {
        key: fs.readFileSync(options.KEY),
        cert: fs.readFileSync(options.CERT),
        requestCert: true,
        rejectUnauthorized: true,
        passphrase: options.PASSWORD,
        ca: [fs.readFileSync(options.CERT)]
    } : null;
    this.ssl = options.SSL;
}
wsServer.prototype.listen = function (port, func) {

    var net = require(this.ssl ? 'tls' : 'net');
    var tcpserver = net.createServer(this.options, onClientConnect.bind(this));
    tcpserver.listen(port, func);
    tcpserver.on('close', this.onClose.bind(this));
    tcpserver.on('error', this.onError.bind(this));
    this.tcpServer = tcpserver;
}
wsServer.prototype.send = function (msg, socket) {
    socket.send(msg);
}
wsServer.prototype.close = function () {
    return new Promise((resolve) => {
        this.tcpServer.close(resolve);
    });
}

module.exports = wsServer;
function onClientConnect(socket) {

    socket.send = function (msg) {
        if (msg)
            this.protocol.sendData(msg, socket);
    }
    socket.on('close', this.onClientClose.bind(this, socket));
    socket.on('error', this.onClientError.bind(this, socket));
    var $this = this;
    socket.setTimeout(3000);
    socket.on('timeout', this.onClientTimeout.bind(this, socket));
    $this.onSocketIn(socket);
    socket.on('data', function (data) {
        if (socket.protocol) {
            socket.protocol.readData(data, socket, $this);
        } else {
            var header = readHeader(data);
            socket.requestHeader = header;
            if (header["Sec-WebSocket-Key"]) {
                socket.protocol = protocols.var1;
            } else if (header["Sec-WebSocket-Key1"]) {
                socket.protocol = protocols.var2;
            } else {
                socket.protocol = protocols.tcp;
                socket.protocol.readData(data, socket, $this);
                return;
            }
            socket.protocol.handShake(header, socket, data);
            $this.onConnect(socket);
        }
    });
}
var protocols = {
    var1: {
        handShake: function (header, socket) {
            var hasher = crypto.createHash("sha1");
            hasher.update(header["Sec-WebSocket-Key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
            var hashmsg = hasher.digest().toString('base64');
            var origin = header.Origin;
            var protocol = header['sec-websocket-protocol'];
            if (protocol)
                protocol.split(/, */);
            var respon = ["HTTP/1.1 101 Switching Protocols",
                "Connection: Upgrade",
                "Upgrade: WebSocket",
                `Sec-WebSocket-Accept:${hashmsg}`,
                `Sec-WebSocket-Origin:${origin}`];
            if (protocol) respon.push(`Sec-WebSocket-Protocol: ${protocol}`);
            //var extens = header["Sec-Websocket-Extensions"];
            //if (extens) {
            //    respon.push(`Sec-WebSocket-Extensions:permessage-deflate; client_max_window_bits`);
            //}
            respon.push("\r\n");
            socket.write(respon.join("\r\n"));
        },
        readData: function (data, socket, server) {
            var start = 0;
            while (start < data.length) {
                var iseof = (data[start] >> 7) > 0;
                var frameType = data[start++] & 0xF;
                var hasMask = (data[start] >> 7) > 0;
                var length = (data[start++] & 0x7F);
                if (length == 126) {
                    length = data.readUInt16BE(start);
                    start = start + 2;
                }
                else if (length == 127) {
                    length = data.readUInt32BE(start);
                    start = start + 4;
                    return;
                }
                var markIndex = start;
                start = start + 4;
                for (let i = 0; i < length; i++) {
                    data[start] = data[start] ^ data[markIndex + (i % 4)];
                    start++;
                }
                switch (frameType) {
                    case FrameTypes.Close:
                        socket.end();
                        // server.onClientClose(socket);
                        break;
                    case FrameTypes.Binary:
                        break;
                    case FrameTypes.Ping:
                        break;
                    case FrameTypes.Pong:
                        break;
                    case FrameTypes.Text:
                        var msg = data.toString("utf8", markIndex + 4, markIndex + 4 + length);
                        server.onReceive(msg, socket);
                        break;
                    default:
                        break;
                }
            }
        },
        sendData: function (text, socket) {
            var textBuffer = Buffer.from(text);
            var length = textBuffer.length;
            var data;
            if (length < 126) {
                data = Buffer.alloc(length + 2);
                data[0] = 129;
                data.writeUInt8(length, 1);
                textBuffer.copy(data, 2);
            }
            else if (length >= 126 && length < 65536) {
                data = Buffer.alloc(length + 4);
                data[0] = 129;
                data.writeUInt8(126, 1);
                data.writeUInt16BE(length, 2);
                textBuffer.copy(data, 4);
            } else {
                data = Buffer.alloc(length + 10);
                data[0] = 0x81;
                data[1] = 127;
                data.writeUInt32BE(0, 2);
                data.writeUInt32BE(length, 6);
                textBuffer.copy(data, 10);
            }
            socket.write(data);
        }
    },
    var2: {
        handShake: function (header, socket, buffer) {
            var key1 = header["Sec-WebSocket-Key1"];
            var key2 = header["Sec-WebSocket-Key2"];

            var origin = header["Origin"];

            var n1 = getNumber(key1);
            n1 = parseInt(n1);
            n1 = n1 / getSpace(key1);

            var n2 = getNumber(key2);
            n2 = parseInt(n2);
            n2 = n2 / getSpace(key2);

            var buf = Buffer.alloc(16);

            buf.writeIntBE(n1, 0, 4, true);

            buf.writeIntBE(n2, 4, 4, true);

            buffer.copy(buf, 8, buffer.length - 8, buffer.length);

            var hasherbs = crypto.createHash("md5");
            hasherbs = hasherbs.update(buf);
            hasherbs = hasherbs.digest();

            var host = "ws://" + header["Host"] + "/";
            var headers = [
                "HTTP/1.1 101 WebSocket Protocol Handshake",
                "Upgrade: WebSocket",
                "Connection: Upgrade",
                "Sec-WebSocket-Origin:" + origin,
                "Sec-WebSocket-Location:" + host
                , "\r\n"
            ];
            socket.write(headers.join("\r\n"));
            socket.write(hasherbs);
        },
        buffer: null
        ,
        readData: function (data, socket, server) {
            var start = 0;
            while (start < data.length) {
                if (data[start] != 0) {
                    break;//error
                }
                var end = start + 1;
                while (data[end] != 255 && end < data.length) {
                    end++;
                }
                var msg = data.toString("utf8", start + 1, end);
                server.onReceive(msg, socket);
                start = end + 1;
            }
        },
        sendData: function (text, socket) {
            var textBuffer = Buffer.from(text, "utf-8");
            var length = textBuffer.length;

            var wrappedBytes = Buffer.alloc(length + 2);
            wrappedBytes[0] = 0;
            textBuffer.copy(wrappedBytes, 1);
            wrappedBytes[wrappedBytes.length - 1] = 255;
            socket.write(wrappedBytes);
        }
    },
    tcp: {

        readData: function (data, socket, server) {

            var start = 0;
            if (socket.unread_data) {
                data = Buffer.concat([socket.unread_data, data], socket.unread_data.length + data.length);
                socket.unread_data = null;
            }
            let isread = false;
            while (start < data.length) {
                let length = data.readUInt8(start);
                let index = start + 1;
                if (length === 254) {
                    //不够读长度咋办
                    length = data.readUInt16BE(index);
                    index += 2;
                } else if (length === 255) {
                    length = data.readUInt32BE(index);
                    index += 4;
                }
                if (data.length < index + length) {
                    socket.unread_data = isread ? data.slice(start) : data;
                    return;
                }
                let msg = data.toString("utf8", index, index + length);

                isread = true;

                server.onTcpReceive(msg, socket);

                start = index + length;

            }
        },
        sendData: function (text, socket) {
            var textBuffer = Buffer.from(text);
            var length = textBuffer.length;
            var data;
            if (length < 254) {
                data = Buffer.alloc(length + 1);
                data.writeUInt8(length);
                textBuffer.copy(data, 1);
            }
            else if (length >= 254 && length < 65536) {
                data = Buffer.alloc(length + 3);
                data.writeUInt8(254);
                data.writeUInt16BE(length, 1);
                textBuffer.copy(data, 3);
            } else {
                data = Buffer.alloc(length + 5);
                data.writeUInt8(255);
                data.writeUInt32BE(length, 1);
                textBuffer.copy(data, 5);
            }
            socket.write(data);
        }
    }
};

function getNumber(str) {
    return str.replace(/\D/g, "");

}
function getSpace(str) {
    return str.replace(/\S/g, "").length;
}
function readHeader(data) {
    var header = {}, key, flag = 0;
    for (var i = 0; i < data.length; i++) {
        switch (data[i]) {
            case 0x0D://\r
                key && (header[key] = data.toString("utf8", flag, i));
                break;
            case 0x0A://\n
                key = null;
                flag = i + 1;
                break;
            case 0x3A://:
                if (!key) {
                    key = data.toString("utf8", flag, i);
                    data[i + 1] == 0x20 ? flag = i + 2 : flag = i + 1;
                }
                break;
        }
    }
    if (flag < data.length) {
        header.CONTENT = data.toString("utf8", flag);

    }
    return header;
}
var FrameTypes =
{
    Continuation: 0,
    Text: 1,
    Binary: 2,
    Close: 8,
    Ping: 9,
    Pong: 10,
};

//%x0 代表一个继续帧
//%x1 代表一个文本帧
//%x2 代表一个二进制帧
//%x3-7 保留用于未来的非控制帧
//%x8 代表连接关闭
//%x9 代表ping
//%xA 代表pong
//%xB-F 保留用于未来的控制帧 