
import * as Util from './utils/util.js';
import Setting from './setting.js';

let IsConnecting = false;
let ChangeServer = false;
export let GameClient = null;
export let SelectedServer = null;
export let LastCommand = null;
const SessionKey = "u";
const SessionToken = "p";

export function connectServer(server, pid) {
    if (IsConnecting) return;

    SelectedServer = server;
    console.log("重新连接", GameClient == null ? "未连接" : "已连接");
    closeServer();
    GameClient = new WSClient(server.ip, server.port);
    IsConnecting = true;
    GameClient.OnError = (err) => {
        IsConnecting = false;
        if (err) {
            if (err.isTrusted) err = "服务器没有响应，请稍后重试";
            showLoader("<strong>连接失败：</strong>" + err + "");
        }
    }
    GameClient.OnConnect = () => {
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

    GameClient.OnClose = () => {
        IsConnecting = false;
        if (ChangeServer) {
            ChangeServer = false;
            return;
        }
        if (GameClient.Connected()) return;

        if (Process.player) {
            Process.clear();
            ReceiveMessage("<red>你的连接中断了...</red>");
        } else {
            setTimeout(() => {
                hide2show($("#slist_panel"));
            }, 3000);
        }
    }
    GameClient.OnData = ReceiveData;
    GameClient.OnMessage = ReceiveMessage;
    GameClient.Connect();
}

export function isConnected() {
    if (!GameClient) return false;
    return GameClient.Connected();
}

export function SendCommand(cmd) {
    if (IsConnecting) return;
    if (Setting.show_send) {
        var d = new Date();
        var time = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
        ReceiveMessage("<hio>" + time + "</hio> " + "<HIW>" + cmd+ "</HIW>");
    }
    if (!GameClient || !GameClient.Connected()) {
        LastCommand = cmd;
        ReceiveMessage("<red>连接中断，正在重新连线...</red>");
        return connectServer(SelectedServer);
    }
    Dialog.extend.record(cmd);
    GameClient.Send(cmd);
}

export function onLogin() {
    if (LastCommand) {
        SendCommand(LastCommand);
        LastCommand = null;
    }
}

export function ReceiveMessage(x) {
    if (Dialog.extend.message_filter(x)) return;
    Process._lastMessageText = x;
    Process.message.push(x);
    Process.message.scroll2end();
    Dialog.extend.trigger(x);
}

export function ReceiveData(data) {
    if (Dialog.extend.data_filter(data)) return;
    var func = Process[data.type];
    func && func(data);
    Dialog.extend.process(data);
}

export function closeServer() {
    if (GameClient && GameClient.Connected()) {
        GameClient.Destroy();
    }
    GameClient = null;
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
            elem1 = $(p[i]); break;
        }
    }
    if (!elem1) elem1 = $("#login_panel");
    elem1.animate({ opacity: 0 }, "fast", function () {
        elem1.hide();
        if (elem2 == ".container") $(".login-content").hide();
        else $(".login-content").show();
        if (elem2) {
            elem2 = $(elem2);
            elem2.show();
            elem2.css("opacity", "0");
            elem2.animate({ opacity: 1 }, "slow", callback);
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
            this.ws.onopen = this.OnConnect;
            this.ws.onclose = this.OnClose.bind(this);
            this.ws.onerror = this.OnError;
            this.ws.onmessage = this.OnReceived.bind(this);
            this.index = wsindex++;
        } catch (e) {
            this.OnError && this.OnError(e);
        }
    }
    OnReceived(evt) {
        if (!evt || !evt.data) return;
        var data = evt.data;
        if (data[0] == '{' || data[0] == '[') {
            try {
                var func = new Function("return " + data + ";");
                this.OnData(func());
            } catch (e) {
                console.error('OnReceived parse error:', e.message, data.substring(0, 200));
                try {
                    this.OnData(JSON.parse(data));
                } catch (e2) {
                    console.error('OnReceived JSON parse also failed:', e2.message);
                    this.OnMessage(data);
                }
            }
        } else {
            this.OnMessage(data);
        }
    }
    Send(text) {
        try {
            this.ws.send(text);
        } catch (e) {
            ReceiveMessage(e);
        }
    }
    Destroy() {
        this.ws.onclose = null;
        this.ws.close();
    }
    Close() {
        this.ws.close();
    }
    Connected() {
        return this.ws && this.ws.readyState == 1;
    }
}
