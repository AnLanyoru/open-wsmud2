/**
 * WebSocket/TCP 网络层实现
 * 支持多种WebSocket协议版本及原始TCP
 */
"use strict";

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import crypto from 'crypto';
import fs from 'fs';

/**
 * WebSocket/TCP 服务器
 */
export default class wsServer {
    /**
     * @param {{SSL: boolean, KEY: string, CERT: string, PASSWORD: string}} options - SSL配置
     */
    constructor(options) {
        const evt = ["Close", "Error", "SocketIn", "Connect", "Receive",
            "ClientError", "ClientClose", "ClientTimeout"];
        for (let i = 0; i < evt.length; i++) {
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

    /**
     * 启动监听
     * @param {number} port - 端口号
     * @param {function} func - 启动成功回调
     * @returns {void}
     */
    listen(port, func) {

        const net = require(this.ssl ? 'tls' : 'net');
        const tcpserver = net.createServer(this.options, onClientConnect.bind(this));
        tcpserver.listen(port, func);
        tcpserver.on('close', this.onClose.bind(this));
        tcpserver.on('error', this.onError.bind(this));
        this.tcpServer = tcpserver;
    }

    /**
     * 发送消息到socket
     * @param {string} msg
     * @param {*} socket
     * @returns {void}
     */
    send(msg, socket) {
        socket.send(msg);
    }

    /**
     * 关闭服务器
     * @returns {Promise<void>}
     */
    close() {
        return new Promise((resolve) => {
            this.tcpServer.close(resolve);
        });
    }
}

/**
 * 客户端连接处理
 * @param {*} socket
 * @returns {void}
 */
function onClientConnect(socket) {

    socket.send = function (msg) {
        if (msg)
            this.protocol.sendData(msg, socket);
    }
    socket.on('close', this.onClientClose.bind(this, socket));
    socket.on('error', this.onClientError.bind(this, socket));
    const $this = this;
    socket.setTimeout(3000);
    socket.on('timeout', this.onClientTimeout.bind(this, socket));
    $this.onSocketIn(socket);
    socket.on('data', function (data) {
        if (socket.protocol) {
            socket.protocol.readData(data, socket, $this);
        } else {
            const header = readHeader(data);
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

const protocols = {
    /** WebSocket 协议版本13 (RFC 6455) */
    var1: {
        /**
         * WebSocket握手
         * @param {Object<string, string>} header - HTTP头部
         * @param {*} socket
         * @returns {void}
         */
        handShake(header, socket) {
            const hasher = crypto.createHash("sha1");
            hasher.update(header["Sec-WebSocket-Key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
            const hashmsg = hasher.digest().toString('base64');
            const origin = header.Origin;
            let protocol = header['sec-websocket-protocol'];
            if (protocol)
                protocol.split(/, */);
            const respon = ["HTTP/1.1 101 Switching Protocols",
                "Connection: Upgrade",
                "Upgrade: WebSocket",
                `Sec-WebSocket-Accept:${hashmsg}`,
                `Sec-WebSocket-Origin:${origin}`];
            if (protocol) respon.push(`Sec-WebSocket-Protocol: ${protocol}`);
            respon.push("\r\n");
            socket.write(respon.join("\r\n"));
        },
        /**
         * 读取WebSocket帧数据
         * @param {Buffer} data
         * @param {*} socket
         * @param {wsServer} server
         * @returns {void}
         */
        readData(data, socket, server) {
            let start = 0;
            while (start < data.length) {
                const iseof = (data[start] >> 7) > 0;
                const frameType = data[start++] & 0xF;
                const hasMask = (data[start] >> 7) > 0;
                let length = (data[start++] & 0x7F);
                if (length == 126) {
                    length = data.readUInt16BE(start);
                    start = start + 2;
                }
                else if (length == 127) {
                    length = data.readUInt32BE(start);
                    start = start + 4;
                    return;
                }
                const markIndex = start;
                start = start + 4;
                for (let i = 0; i < length; i++) {
                    data[start] = data[start] ^ data[markIndex + (i % 4)];
                    start++;
                }
                switch (frameType) {
                    case FrameTypes.Close:
                        socket.end();
                        break;
                    case FrameTypes.Binary:
                        break;
                    case FrameTypes.Ping:
                        break;
                    case FrameTypes.Pong:
                        break;
                    case FrameTypes.Text:
                        const msg = data.toString("utf8", markIndex + 4, markIndex + 4 + length);
                        server.onReceive(msg, socket);
                        break;
                    default:
                        break;
                }
            }
        },
        /**
         * 发送WebSocket帧
         * @param {string} text
         * @param {*} socket
         * @returns {void}
         */
        sendData(text, socket) {
            const textBuffer = Buffer.from(text);
            const length = textBuffer.length;
            let data;
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
    /** WebSocket 协议版本00(Hixie) - 已废弃的旧版本 */
    var2: {
        /**
         * WebSocket Hixie协议握手
         * @param {Object<string, string>} header
         * @param {*} socket
         * @param {Buffer} buffer
         * @returns {void}
         */
        handShake(header, socket, buffer) {
            const key1 = header["Sec-WebSocket-Key1"];
            const key2 = header["Sec-WebSocket-Key2"];

            const origin = header["Origin"];

            let n1 = getNumber(key1);
            n1 = parseInt(n1);
            n1 = n1 / getSpace(key1);

            let n2 = getNumber(key2);
            n2 = parseInt(n2);
            n2 = n2 / getSpace(key2);

            const buf = Buffer.alloc(16);

            buf.writeIntBE(n1, 0, 4, true);

            buf.writeIntBE(n2, 4, 4, true);

            buffer.copy(buf, 8, buffer.length - 8, buffer.length);

            let hasherbs = crypto.createHash("md5");
            hasherbs = hasherbs.update(buf);
            hasherbs = hasherbs.digest();

            const host = "ws://" + header["Host"] + "/";
            const headers = [
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
        /** @type {Buffer|null} */
        buffer: null,
        /**
         * 读取Hixie协议帧数据
         * @param {Buffer} data
         * @param {*} socket
         * @param {wsServer} server
         * @returns {void}
         */
        readData(data, socket, server) {
            let start = 0;
            while (start < data.length) {
                if (data[start] != 0) {
                    break;//error
                }
                let end = start + 1;
                while (data[end] != 255 && end < data.length) {
                    end++;
                }
                const msg = data.toString("utf8", start + 1, end);
                server.onReceive(msg, socket);
                start = end + 1;
            }
        },
        /**
         * 发送Hixie协议帧数据
         * @param {string} text
         * @param {*} socket
         * @returns {void}
         */
        sendData(text, socket) {
            const textBuffer = Buffer.from(text, "utf-8");
            const length = textBuffer.length;

            const wrappedBytes = Buffer.alloc(length + 2);
            wrappedBytes[0] = 0;
            textBuffer.copy(wrappedBytes, 1);
            wrappedBytes[wrappedBytes.length - 1] = 255;
            socket.write(wrappedBytes);
        }
    },
    /** 原始TCP协议(自定义长度前缀) */
    tcp: {
        /**
         * 读取TCP协议帧数据
         * @param {Buffer} data
         * @param {*} socket
         * @param {wsServer} server
         * @returns {void}
         */
        readData(data, socket, server) {

            let start = 0;
            if (socket.unread_data) {
                data = Buffer.concat([socket.unread_data, data], socket.unread_data.length + data.length);
                socket.unread_data = null;
            }
            let isread = false;
            while (start < data.length) {
                let length = data.readUInt8(start);
                let index = start + 1;
                if (length === 254) {
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
                const msg = data.toString("utf8", index, index + length);

                isread = true;

                server.onTcpReceive(msg, socket);

                start = index + length;

            }
        },
        /**
         * 发送TCP协议帧数据
         * @param {string} text
         * @param {*} socket
         * @returns {void}
         */
        sendData(text, socket) {
            const textBuffer = Buffer.from(text);
            const length = textBuffer.length;
            let data;
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

/**
 * 从字符串中提取数字部分
 * @param {string} str
 * @returns {string}
 */
function getNumber(str) {
    return str.replace(/\D/g, "");

}

/**
 * 计算字符串中空格数量
 * @param {string} str
 * @returns {number}
 */
function getSpace(str) {
    return str.replace(/\S/g, "").length;
}

/**
 * 解析HTTP头部
 * @param {Buffer} data
 * @returns {Object<string, string>}
 */
function readHeader(data) {
    const header = {};
    let key, flag = 0;
    for (let i = 0; i < data.length; i++) {
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

/**
 * WebSocket 帧类型枚举
 * @readonly
 * @enum {number}
 */
const FrameTypes =
{
    Continuation: 0,
    Text: 1,
    Binary: 2,
    Close: 8,
    Ping: 9,
    Pong: 10,
};
