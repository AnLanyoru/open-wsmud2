/**
 * WebSocket/TCP 网络层实现
 * 支持多种WebSocket协议版本及原始TCP
 */

import { createRequire } from 'module';

const require = createRequire(import.meta.url);

import crypto from 'crypto';
import fs from 'fs';

// ============================================================
// Socket 类型 — net.Socket + 自定义扩展属性
// ============================================================

/** WebSocket/TCP Socket 扩展类型 */
export interface WsSocket {
    /** 远程地址 */
    remoteAddress?: string;

    /** 设置超时 */
    setTimeout(ms: number, callback?: () => void): this;

    /** 结束连接 */
    end(data?: string | Buffer, encoding?: string): this;

    /** 销毁连接 */
    destroy(): this;

    /** 写入数据 */
    write(data: string | Buffer): boolean;

    /** 注册事件监听 */
    on(event: string, handler: (...args: any[]) => void): this;

    /** 移除事件监听 */
    removeListener(event: string, handler: (...args: any[]) => void): this;

    /** 发送文本消息（由 onClientConnect 注入） */
    send?: (msg: string | Buffer) => void;
    /** 发送二进制消息（由 onClientConnect 注入） */
    sendBinary?: (data: Buffer) => void;
    /** 当前使用的协议处理器 */
    protocol?: WsProtocol;
    /** HTTP 请求头（WebSocket 握手阶段解析） */
    requestHeader?: Record<string, string>;
    /** TCP 未读完的数据缓存 */
    unread_data?: Buffer | null;
    /** 所属用户对象 */
    user?: Record<string, any> | null;
    /** 关联的跨服连接 */
    oserver?: Record<string, any> | null;
    /** 是否已销毁 */
    destroyed?: boolean;
}

/** 通信协议接口 */
export interface WsProtocol {
    /** 发送文本帧 */
    sendData: (text: string, socket: WsSocket) => void;
    /** 发送二进制帧 */
    sendBinaryData: (data: Buffer, socket: WsSocket) => void;
    /** WebSocket 握手（TCP 协议无需） */
    handShake?: (header: Record<string, string>, socket: WsSocket, data?: Buffer) => void;
    /** 读取并解析收到的数据 */
    readData: (data: Buffer, socket: WsSocket, server: wsServer) => void;
}

// ============================================================
// WebSocket 帧类型
// ============================================================

/** WebSocket 帧类型常量 (RFC 6455) */
export const FrameTypes = {
    Continuation: 0,
    Text: 1,
    Binary: 2,
    Close: 8,
    Ping: 9,
    Pong: 10,
} as const;

// ============================================================
// WebSocket / TCP 服务器
// ============================================================

export default class wsServer {
    /** SSL/TLS 配置选项 (null 表示非 SSL) */
    options: {
        key: Buffer;
        cert: Buffer;
        requestCert: boolean;
        rejectUnauthorized: boolean;
        passphrase: string;
        ca: Buffer[];
    } | null;
    /** 是否启用 SSL */
    ssl: boolean;
    /** 底层 TCP/TLS 服务器实例 */
    tcpServer?: {
        close(cb: () => void): void;
        on(event: string, cb: () => void): void;
    };

    // === 事件回调（外部可覆盖） ===

    /** 服务器关闭回调 */
    onClose: () => void = () => {};
    /** 服务器错误回调 */
    onError: (err: Error) => void = () => {};
    /** 新 socket 接入回调 */
    onSocketIn: (socket: WsSocket) => void = () => {};
    /** 新连接建立回调（WebSocket 握手完成） */
    onConnect: (socket: WsSocket) => void = () => {};
    /** WebSocket 消息接收回调 */
    onReceive: (msg: string, socket: WsSocket) => void = () => {};
    /** TCP 消息接收回调 */
    onTcpReceive: (msg: string, socket: WsSocket) => void = () => {};
    /** 客户端错误回调 */
    onClientError: (socket: WsSocket, err: Error) => void = () => {};
    /** 客户端断开回调 */
    onClientClose: (socket: WsSocket, hadError?: Error) => void = () => {};
    /** 客户端超时回调 */
    onClientTimeout: (socket: WsSocket, err?: Error) => void = () => {};

    /** 启动监听 — ws.ts 中动态赋值 */
    start!: (port: number) => Promise<void>;

    /**
     * @param options - SSL 配置
     */
    constructor(options: { SSL: boolean; KEY: string; CERT: string; PASSWORD: string }) {
        this.options = options.SSL
            ? {
                  key: fs.readFileSync(options.KEY),
                  cert: fs.readFileSync(options.CERT),
                  requestCert: true,
                  rejectUnauthorized: true,
                  passphrase: options.PASSWORD,
                  ca: [fs.readFileSync(options.CERT)],
              }
            : null;
        this.ssl = options.SSL;
    }

    /**
     * 启动监听
     * @param port - 端口号
     * @param func - 启动成功回调
     */
    listen(port: number, func?: () => void): void {
        const net = require(this.ssl ? 'tls' : 'net');
        const tcpserver = net.createServer(this.options, onClientConnect.bind(this));
        tcpserver.listen(port, func);
        tcpserver.on('close', this.onClose.bind(this));
        tcpserver.on('error', this.onError.bind(this));
        this.tcpServer = tcpserver;
    }

    /**
     * 发送消息到 socket
     */
    send(msg: string, socket: WsSocket): void {
        socket.send?.(msg);
    }

    /**
     * 关闭服务器
     */
    close(): Promise<void> {
        return new Promise(resolve => {
            this.tcpServer!.close(resolve);
        });
    }
}

// ============================================================
// 客户端连接处理
// ============================================================

/**
 * 客户端连接处理 — 绑定 send、设置超时、自动识别协议
 * @this wsServer 实例
 * @param socket - 客户端 socket
 */
function onClientConnect(this: wsServer, socket: WsSocket): void {
    socket.send = function (this: WsSocket, msg: string | Buffer): void {
        if (msg) {
            if (Buffer.isBuffer(msg)) {
                this.protocol?.sendBinaryData(msg, this);
            } else {
                this.protocol?.sendData(msg, this);
            }
        }
    };

    socket.sendBinary = function (this: WsSocket, data: Buffer): void {
        if (data) {
            this.protocol?.sendBinaryData(data, this);
        }
    };

    socket.on('close', this.onClientClose.bind(this, socket));
    socket.on('error', this.onClientError.bind(this, socket));

    const $this = this;
    socket.setTimeout(3000);
    socket.on('timeout', this.onClientTimeout.bind(this, socket));
    $this.onSocketIn(socket);

    socket.on('data', function (data: Buffer) {
        if (socket.protocol) {
            socket.protocol.readData(data, socket, $this);
        } else {
            const header = readHeader(data);
            socket.requestHeader = header;
            if (header['Sec-WebSocket-Key']) {
                socket.protocol = protocols.var1;
            } else if (header['Sec-WebSocket-Key1']) {
                socket.protocol = protocols.var2;
            } else {
                socket.protocol = protocols.tcp;
                socket.protocol.readData(data, socket, $this);
                return;
            }
            socket.protocol.handShake?.(header, socket, data);
            $this.onConnect(socket);
        }
    });
}

// ============================================================
// 协议实现
// ============================================================

const protocols: {
    var1: Required<WsProtocol>;
    var2: Required<WsProtocol> & { buffer: Buffer | null };
    tcp: WsProtocol;
} = {
    /** WebSocket 协议版本 13 (RFC 6455) */
    var1: {
        handShake(header: Record<string, string>, socket: WsSocket): void {
            const hasher = crypto.createHash('sha1');
            hasher.update(header['Sec-WebSocket-Key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
            const hashmsg = hasher.digest().toString('base64');
            const origin = header['Origin'];
            let protocol: string | undefined = header['sec-websocket-protocol'];
            if (protocol) {
                protocol.split(/, */); // intentional: validate format
            }
            const respon: string[] = [
                'HTTP/1.1 101 Switching Protocols',
                'Connection: Upgrade',
                'Upgrade: WebSocket',
                `Sec-WebSocket-Accept:${hashmsg}`,
                `Sec-WebSocket-Origin:${origin}`,
            ];
            if (protocol) respon.push(`Sec-WebSocket-Protocol: ${protocol}`);
            respon.push('\r\n');
            socket.write(respon.join('\r\n'));
        },

        readData(data: Buffer, socket: WsSocket, server: wsServer): void {
            let start = 0;
            while (start < data.length) {
                // 需要至少 2 字节帧头
                if (start + 2 > data.length) {
                    break;
                }
                const iseof = data[start] >> 7 > 0;
                const frameType = data[start++] & 0xf;
                const hasMask = data[start] >> 7 > 0;
                let length = data[start++] & 0x7f;
                if (length === 126) {
                    if (start + 2 > data.length) break;
                    length = data.readUInt16BE(start);
                    start = start + 2;
                } else if (length === 127) {
                    // 8 字节扩展长度 (64-bit, RFC 6455 §5.2)
                    if (start + 8 > data.length) break;
                    const high = data.readUInt32BE(start);
                    const low = data.readUInt32BE(start + 4);
                    start = start + 8;
                    // 拒绝超过 10MB 或 high>0 (>4GB) 的帧
                    if (high > 0 || low > 10 * 1024 * 1024) {
                        socket.end();
                        return;
                    }
                    length = low;
                }

                // 客户端帧必须带 mask (RFC 6455 §5.1)
                if (!hasMask) {
                    socket.end();
                    return;
                }

                // 确保帧载荷完整存在于本次 buffer 中
                if (start + 4 + length > data.length) {
                    break;
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
                        // 收到 Ping 回复空 Pong 即可，无需回传载荷
                        if (length <= 125) {
                            writeRawFrame(socket, FrameTypes.Pong, Buffer.alloc(0));
                        }
                        break;
                    case FrameTypes.Pong:
                        break;
                    case FrameTypes.Text:
                        void iseof; // FIN 标志：当前仅处理非分片帧
                        const msg = data.toString('utf8', markIndex + 4, markIndex + 4 + length);
                        server.onReceive(msg, socket);
                        break;
                    default:
                        break;
                }
            }
        },

        sendData(text: string, socket: WsSocket): void {
            const textBuffer = Buffer.from(text);
            const length = textBuffer.length;
            let data: Buffer;
            if (length < 126) {
                data = Buffer.alloc(length + 2);
                data[0] = 129;
                data.writeUInt8(length, 1);
                textBuffer.copy(data, 2);
            } else if (length >= 126 && length < 65536) {
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
        },

        sendBinaryData(data: Buffer, socket: WsSocket): void {
            writeRawFrame(socket, FrameTypes.Binary, data);
        },
    },

    /** WebSocket 协议版本 00 (Hixie) - 已废弃的旧版本 */
    var2: {
        handShake(header: Record<string, string>, socket: WsSocket, buffer: Buffer): void {
            const key1 = header['Sec-WebSocket-Key1'];
            const key2 = header['Sec-WebSocket-Key2'];
            const origin = header['Origin'];

            let n1: any = getNumber(key1);
            n1 = parseInt(n1);
            n1 = n1 / getSpace(key1);

            let n2: any = getNumber(key2);
            n2 = parseInt(n2);
            n2 = n2 / getSpace(key2);

            const buf = Buffer.alloc(16);
            buf.writeIntBE(n1, 0, 4);
            buf.writeIntBE(n2, 4, 4);
            buffer.copy(buf, 8, buffer.length - 8, buffer.length);

            let hasherbs = crypto.createHash('md5');
            hasherbs.update(buf);
            const digestResult = hasherbs.digest();

            const host = 'ws://' + header['Host'] + '/';
            const headers = [
                'HTTP/1.1 101 WebSocket Protocol Handshake',
                'Upgrade: WebSocket',
                'Connection: Upgrade',
                'Sec-WebSocket-Origin:' + origin,
                'Sec-WebSocket-Location:' + host,
                '\r\n',
            ];
            socket.write(headers.join('\r\n'));
            socket.write(digestResult);
        },

        buffer: null as Buffer | null,

        readData(data: Buffer, socket: WsSocket, server: wsServer): void {
            let start = 0;
            while (start < data.length) {
                if (data[start] !== 0) {
                    break; // error
                }
                let end = start + 1;
                while (data[end] !== 255 && end < data.length) {
                    end++;
                }
                const msg = data.toString('utf8', start + 1, end);
                server.onReceive(msg, socket);
                start = end + 1;
            }
        },

        sendData(text: string, socket: WsSocket): void {
            const textBuffer = Buffer.from(text, 'utf-8');
            const length = textBuffer.length;
            const wrappedBytes = Buffer.alloc(length + 2);
            wrappedBytes[0] = 0;
            textBuffer.copy(wrappedBytes, 1);
            wrappedBytes[wrappedBytes.length - 1] = 255;
            socket.write(wrappedBytes);
        },

        sendBinaryData(data: Buffer, socket: WsSocket): void {
            // 老协议不支持二进制帧，转为 base64 文本发送
            const base64 = data.toString('base64');
            this.sendData(':bin:' + base64, socket);
        },
    },

    /** 原始 TCP 协议 (自定义长度前缀) */
    tcp: {
        handShake(): void {
            // TCP 协议无需握手
        },

        readData(data: Buffer, socket: WsSocket, server: wsServer): void {
            let start = 0;
            if (socket.unread_data) {
                data = Buffer.concat(
                    [socket.unread_data, data],
                    socket.unread_data.length + data.length,
                );
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
                const msg = data.toString('utf8', index, index + length);
                isread = true;
                server.onTcpReceive(msg, socket);
                start = index + length;
            }
        },

        sendData(text: string, socket: WsSocket): void {
            const textBuffer = Buffer.from(text);
            const length = textBuffer.length;
            let data: Buffer;
            if (length < 254) {
                data = Buffer.alloc(length + 1);
                data.writeUInt8(length);
                textBuffer.copy(data, 1);
            } else if (length >= 254 && length < 65536) {
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
        },

        sendBinaryData(data: Buffer, socket: WsSocket): void {
            const length = data.length;
            let frame: Buffer;
            if (length < 254) {
                frame = Buffer.alloc(length + 1);
                frame.writeUInt8(length);
                data.copy(frame, 1);
            } else if (length < 65536) {
                frame = Buffer.alloc(length + 3);
                frame.writeUInt8(254);
                frame.writeUInt16BE(length, 1);
                data.copy(frame, 3);
            } else {
                frame = Buffer.alloc(length + 5);
                frame.writeUInt8(255);
                frame.writeUInt32BE(length, 1);
                data.copy(frame, 5);
            }
            socket.write(frame);
        },
    },
};

// ============================================================
// HTTP 头部解析
// ============================================================

/**
 * 解析 HTTP 头部
 * @param data - 原始数据
 * @returns 头部键值对
 */
function readHeader(data: Buffer): Record<string, string> {
    const header: Record<string, string> = {};
    let key: string | null = null;
    let flag = 0;
    for (let i = 0; i < data.length; i++) {
        switch (data[i]) {
            case 0x0d: // \r
                if (key) {
                    header[key] = data.toString('utf8', flag, i);
                }
                break;
            case 0x0a: // \n
                key = null;
                flag = i + 1;
                break;
            case 0x3a: // :
                if (!key) {
                    key = data.toString('utf8', flag, i);
                    flag = data[i + 1] === 0x20 ? i + 2 : i + 1;
                }
                break;
        }
    }
    if (flag < data.length) {
        header['CONTENT'] = data.toString('utf8', flag);
    }
    return header;
}

// ============================================================
// 工具函数
// ============================================================

/**
 * 将 payload 编码为完整的 WebSocket 二进制帧（无 mask，服务端→客户端），
 * 返回的 Buffer 可直接写入任意多个 socket，避免重复编码。
 * @param payload - 载荷数据
 * @param opcode   - 帧操作码，默认 Binary (0x2)
 */
export function encodeBinaryFrame(payload: Buffer, opcode: number = FrameTypes.Binary): Buffer {
    const length = payload.length;
    let data: Buffer;
    if (length < 126) {
        data = Buffer.alloc(length + 2);
        data[0] = 0x80 | (opcode & 0xf);
        data.writeUInt8(length, 1);
        payload.copy(data, 2);
    } else if (length < 65536) {
        data = Buffer.alloc(length + 4);
        data[0] = 0x80 | (opcode & 0xf);
        data.writeUInt8(126, 1);
        data.writeUInt16BE(length, 2);
        payload.copy(data, 4);
    } else {
        data = Buffer.alloc(length + 10);
        data[0] = 0x80 | (opcode & 0xf);
        data[1] = 127;
        data.writeUInt32BE(0, 2);
        data.writeUInt32BE(length, 6);
        payload.copy(data, 10);
    }
    return data;
}

/**
 * 将文本字符串编码为 WebSocket 文本帧 (opcode=1)。
 * 用于高频广播场景：预编码一次，多个 socket 共用同一 Buffer 写入，
 * 避免每次 socket.send(text) 重复 Buffer.from + alloc + copy。
 */
export function encodeTextFrame(text: string): Buffer {
    return encodeBinaryFrame(Buffer.from(text, 'utf8'), FrameTypes.Text);
}

/**
 * 发送原始 WebSocket 帧（无 mask，服务端到客户端）
 * @param socket   - 目标 socket
 * @param opcode   - 帧操作码
 * @param payload  - 载荷数据
 */
function writeRawFrame(socket: WsSocket, opcode: number, payload: Buffer): void {
    socket.write(encodeBinaryFrame(payload, opcode));
}

/**
 * 从字符串中提取数字部分
 */
function getNumber(str: string): string {
    return str.replace(/\D/g, '');
}

/**
 * 计算字符串中空格数量
 */
function getSpace(str: string): number {
    return str.replace(/\S/g, '').length;
}
