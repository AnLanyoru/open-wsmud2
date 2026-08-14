import * as Util from './utils/util.js';
import Setting from './setting.js';
import { ProcessBinary } from './process.js';
import { reloadIfUpdated } from './templates.js';

let IsConnecting = false;
let ReconnectTimer = null;
let ReconnectAttempt = 0;
let SelectedPid = null;
export let GameClient = null;
export let SelectedServer = null;
export let LastCommand = null;
const SessionKey = "u";
const SessionToken = "p";

const CONNECT_TIMEOUT = 10000;
const RESPONSE_TIMEOUT = 30000;
const MAX_RECONNECT_DELAY = 15000;

export function connectServer(server, pid, isRetry = false) {
    if (IsConnecting) return;

    SelectedServer = server;
    if (!isRetry) SelectedPid = pid || null;
    if (ReconnectTimer) {
        clearTimeout(ReconnectTimer);
        ReconnectTimer = null;
    }
    console.log("重新连接", GameClient == null ? "未连接" : "已连接");
    closeServer();
    const client = new WSClient(server.ip, server.port);
    GameClient = client;
    IsConnecting = true;
    client.OnError = (err) => {
        if (GameClient !== client) return;
        IsConnecting = false;
        if (err && !Process.player) {
            if (err.isTrusted) err = "服务器没有响应，请稍后重试";
            showLoader("<strong>连接失败：</strong>" + err + "");
        }
    }
    client.OnConnect = async () => {
        if (GameClient !== client) return;
        if (isRetry) {
            try {
                if (await reloadIfUpdated()) return;
            } catch (err) {
                console.warn('检查客户端更新失败，继续重新连线', err);
            }
            if (GameClient !== client) return;
        }
        IsConnecting = false;
        if (!pid && !Process.player) {
            showLoader('正在获取角色列表...');
            SendCommand(Util.GetUserCookie(SessionKey) + " " + Util.GetUserCookie(SessionToken));
        } else {
            if (pid) {
                SendCommand(Util.GetUserCookie(SessionKey) + " " + Util.GetUserCookie(SessionToken) + " " + pid + " " + server.ID);
            } else {
                SendCommand(Util.GetUserCookie(SessionKey) + " " + Util.GetUserCookie(SessionToken) + " " + Process.player);
            }
        }
    }

    client.OnClose = () => {
        if (GameClient !== client) return;
        IsConnecting = false;
        GameClient = null;

        if (Process.player) {
            Process.clear();
            ReceiveMessage("<red>你的连接中断了...</red>");
            scheduleReconnect();
        } else {
            setTimeout(() => {
                hide2show($("#slist_panel"));
            }, 3000);
        }
    }
    client.OnData = ReceiveData;
    client.OnMessage = ReceiveMessage;
    client.Connect();
}

function scheduleReconnect() {
    if (ReconnectTimer || IsConnecting || !SelectedServer) return;
    if (typeof navigator != 'undefined' && !navigator.onLine) return;
    const delay = Math.min(1000 * Math.pow(2, ReconnectAttempt++), MAX_RECONNECT_DELAY);
    ReceiveMessage("<red>" + Math.ceil(delay / 1000) + "秒后尝试重新连线...</red>");
    ReconnectTimer = setTimeout(() => {
        ReconnectTimer = null;
        connectServer(SelectedServer, SelectedPid, true);
    }, delay);
}

export function isConnected() {
    if (!GameClient) return false;
    return GameClient.Connected();
}

export function SendCommand(cmd) {
    if (Setting.show_send) {
        var d = new Date();
        var time = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
        ReceiveMessage("<hio>" + time + "</hio> " + "<HIW>" + cmd + "</HIW>");
    }
    if (IsConnecting || !GameClient || !GameClient.Connected()) {
        LastCommand = cmd;
        ReceiveMessage("<red>连接中断，正在重新连线...</red>");
        if (!IsConnecting) connectServer(SelectedServer, SelectedPid, true);
        return;
    }
    Dialog.extend.record(cmd);
    GameClient.Send(cmd);
}

export function onLogin() {
    ReconnectAttempt = 0;
    if (LastCommand) {
        SendCommand(LastCommand);
        LastCommand = null;
    }
}

export function ReceiveMessage(x) {
    if (Dialog.extend.message_filter(x)) return;
    Process._lastMessageText = x;
    Process.message.push(x);
    Process.message.flushScroll();
    Dialog.extend.trigger(x);
}

export function ReceiveData(data) {
    if (Dialog.extend.data_filter(data)) return;
    var func = Process[data.type];
    func && func(data);
    Dialog.extend.process(data);
}

export function closeServer() {
    if (ReconnectTimer) {
        clearTimeout(ReconnectTimer);
        ReconnectTimer = null;
    }
    if (GameClient) GameClient.Destroy();
    GameClient = null;
    IsConnecting = false;
}

export function showInputError(inp, msg) {
    $(inp).focus().parent().find(".input-error").remove();
    $("<div class='input-error'>" + msg + "</div>").insertAfter(inp);
}

export function hide2show(elem2, callback) {
    var elem1;
    var p = $(".login-content").children();
    for (var i = 0; i < p.length; i++) {
        if ($(p[i]).css("display") != "none") {
            elem1 = $(p[i]);
            break;
        }
    }
    if (!elem1) elem1 = $("#login_panel");
    elem1.animate({opacity: 0}, "fast", function () {
        elem1.hide();
        if (elem2 == ".container") $(".login-content").hide();
        else $(".login-content").show();
        if (elem2) {
            elem2 = $(elem2);
            elem2.show();
            elem2.css("opacity", "0");
            elem2.animate({opacity: 1}, "slow", callback);
        }
    });
}

export function showLoader(msg, elem) {
    var p = $(".login-content").children();
    for (var i = 0; i < p.length; i++) {
        if ($(p[i]).css("display") != "none"
            && !$(p[i]).is(".signinfo")) {
            $(p[i]).hide();
        }
    }
    var loader = $("#loader").css("opacity", 1).show();
    loader.find("#loader_msg").html(msg);
}

let wsindex = 0;

export class WSClient {
    constructor(ip, port) {
        if (ip === '127.0.0.1' || ip === '0.0.0.0') {
            ip = location.hostname;
        }
        this.IP = ip;
        this.Port = port;
    }

    Connect(callback) {
        try {
            var pol = location.protocol == "http:" ? "ws" : "wss";
            this.ws = new WebSocket(pol + '://' + this.IP + ':' + this.Port);
            this.ws.binaryType = 'arraybuffer';
            this.connectTimer = setTimeout(() => {
                if (this.ws && this.ws.readyState == WebSocket.CONNECTING) {
                    this.OnError && this.OnError("连接超时");
                    this.Terminate();
                }
            }, CONNECT_TIMEOUT);
            this.ws.onopen = (evt) => {
                this._clearConnectTimer();
                this.OnConnect && this.OnConnect(evt);
            };
            this.ws.onclose = (evt) => {
                this._clearTimers();
                this.OnClose && this.OnClose(evt);
            };
            this.ws.onerror = (evt) => {
                this.OnError && this.OnError(evt);
                if (!this.errorTimer) {
                    this.errorTimer = setTimeout(() => this.Terminate(), 1000);
                }
            };
            this.ws.onmessage = this.OnReceived.bind(this);
            this.index = wsindex++;
        } catch (e) {
            this.OnError && this.OnError(e);
        }
    }

    OnReceived(evt) {
        if (!evt || !evt.data) return;
        this._clearResponseTimer();
        var data = evt.data;
        // 二进制帧 → 批量解析后逐条处理
        if (data instanceof ArrayBuffer) {
            this._processBinary(new Uint8Array(data));
            return;
        }
        if (data[0] == '{' || data[0] == '[') {
            var parsed = null;
            try {
                var func = new Function("return " + data + ";");
                parsed = func();
            } catch (e1) {
                try {
                    parsed = JSON.parse(data);
                } catch (e2) {
                    // Both parsing methods failed, treat as plain text
                    this.OnMessage(data);
                    return;
                }
            }
            // Parsing succeeded, call OnData; if it throws, do not fall back to OnMessage
            try {
                this.OnData(parsed);
            } catch (e) {
                var errMsg = e instanceof Error ? e.stack || e.message : String(e);
                ReceiveMessage('<hir>解析数据时发生了一个错误，请尝试联系管理解决，具体错误：' + errMsg + '</hir>');
            }
        } else {
            this.OnMessage(data);
        }
    }

    /**
     * 解析二进制帧并逐条分发
     * @param {Uint8Array} data
     */
    _processBinary(data) {
        try {
            ProcessBinary(data);
        } catch (e) {
            ReceiveMessage('<hir>解析二进制数据时发生错误：' + (e.message || e) + '</hir>');
        }
    }

    Send(text) {
        try {
            this.ws.send(text);
            if (!this.responseTimer) {
                this.responseTimer = setTimeout(() => {
                    this.responseTimer = null;
                    if (this.Connected()) {
                        ReceiveMessage('<red>服务器长时间未响应，正在重新连线...</red>');
                        this.Terminate();
                    }
                }, RESPONSE_TIMEOUT);
            }
        } catch (e) {
            ReceiveMessage(e);
            this.Terminate();
        }
    }

    Destroy() {
        this._clearTimers();
        if (!this.ws) return;
        this.ws.onclose = null;
        this.ws.onerror = null;
        this.ws.close();
    }

    Close() {
        // Explicit closes (logout/server switch) must not enter the reconnect flow.
        this.Destroy();
    }

    Terminate() {
        const onClose = this.OnClose;
        this.Destroy();
        onClose && onClose();
    }

    Connected() {
        return this.ws && this.ws.readyState == 1;
    }

    _clearConnectTimer() {
        if (this.connectTimer) clearTimeout(this.connectTimer);
        this.connectTimer = null;
    }

    _clearResponseTimer() {
        if (this.responseTimer) clearTimeout(this.responseTimer);
        this.responseTimer = null;
    }

    _clearTimers() {
        this._clearConnectTimer();
        this._clearResponseTimer();
        if (this.errorTimer) clearTimeout(this.errorTimer);
        this.errorTimer = null;
    }
}

window.addEventListener('online', () => {
    if (Process.player && (!GameClient || !GameClient.Connected())) {
        ReconnectAttempt = 0;
        scheduleReconnect();
    }
});
