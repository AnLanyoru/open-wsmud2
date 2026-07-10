import MessageQueue from './message.js';
import {connectServer, hide2show, isConnected, onLogin, SendCommand, showLoader, GameClient} from './client.js';
import Combat from './combat.js';
import Setting from './setting.js';
import MAP from './map.js';
import SCRIPT from './script.js';
import {roles} from './login/index.js';
import {SERVERS} from "./login/server.js";
import FloatDialog from './floatdialog.js';
import { format, perspective, ready as templatesReady } from './templates.js';

const MessageContent = () => $(".content-message");
const MessagePage = {append: (div) => $(".content-message").append(div)};

const Process = {
    itemsElement: null,
    contentScroll: true,
    message: null,
    channel: null,
    relogin() {
        hide2show('#login_panel')
    },
    clear: function () {
        Dialog.pack.items = null;
        Dialog.skills.items = null;

        this.state(null);
    },
    init: function () {
        Process.itemsElement = $(".room_items");
        this.message = MessageQueue.create($(".content-message"));
        this.ChannelElement = $('.channel');
        this.ChannelElement.on("click", Dialog.channel.show.bind(Dialog.channel));
        this.channel = MessageQueue.create(this.ChannelElement, 4, 200);


    },
    startMoveMessage: function (e) {
        window.addEventListener('mousemove', Process.moveMessage);
        window.addEventListener("mouseup", Process.endMoveMessage);
        Process.mouseY = e.clientY;
    },
    moveMessage: function (e) {

        let diff = Process.mouseY - e.clientY;
        let mc = MessageContent();
        let elem = mc[0];
        let height = mc.height();
        let padding = elem.style.marginBottom;
        if (padding) padding = parseInt(padding.replace('px', ""));
        else padding = 0;
        padding = (padding + diff);
        if (padding < 0) padding = 0;
        else if (padding > height * 0.7) return;
        elem.style.marginBottom = padding + "px";
        Process.mouseY = e.clientY;
        e.preventDefault();
    },
    endMoveMessage: function () {
        window.removeEventListener('mousemove', Process.moveMessage);
        window.removeEventListener("mouseup", Process.endMoveMessage);
    },

    regist: function (x) {
        if (x.result) {
            hide2show("#addrole_panel");
            $("#addrole_panel .input-error").html(x.result);
        }
    },
    emote: function (data) {
        Process.emotes = data.items || 0;
        var str = [];
        for (var i = 0; i < Process.emotes.length; i++) {
            str.push('<span>');
            str.push(Process.emotes[i]);
            str.push("</span>");
        }
        $(".channel-emotes").html(str.join(""));
    }
    , deleterole: function (x) {
        if (x.result) {
            var item = $("#role_panel>ul>.content>.role-list>.role-item[roleid='" + x.id + "']");
            item.remove();
            var elems = $("#role_panel>ul>.content>.role-list>.role-item");
            if (item.is(".select") && elems.length) {
                $(elems[0]).addClass("select");
            } else if (!elems.length) {
                roles.addRole();
            }
        } else {
            Confirm.Show({
                content: "<span class='input-error'>" + (x.message || "删除失败") + "</span>",
            });
        }
    }, cross: function (data) {
        var serv = null;
        for (var i = 0; i < SERVERS.length; i++) {
            if (SERVERS[i].ID == data.sid) {
                serv = SERVERS[i];
            }
        }
        if (!serv) return;

        GameClient.ChangeServer = true;
        GameClient.Close();
        Dialog.pack.items = null;
        if (data.cross_type == 'duizhan') {
            Dialog.skills.items = null;
            Dialog.skills.isShow = false;
        }
        console.log("重新连接到", serv.Name);
        if (!data.pid) Process.die({relive: true});
        connectServer(serv, data.pid);
    }
    ,
    roles: function (x) {
        var result = x.roles;
        if (!result.length) {
            roles.addRole();
        } else {
            hide2show("#role_panel");
            var html = [];
            for (var i = 0; i < result.length; i++) {
                html.push("<li class='role-item");
                if (i == 0) html.push(" select");
                html.push("' roleid='" + result[i].id + "'>");
                html.push(result[i].title);
                html.push("&nbsp;&nbsp;");
                html.push(result[i].name);
                html.push("</li>");
            }
            $(".role-list").html(html.join(""));
        }
    }, loginerror: function (msg) {
        $(".container").hide();
        $(".login-content").show();
        showLoader("<strong>登陆失败：</strong>" + msg.msg + "");

        //hide2show ("#role_panel");
    }, login: function (x) {
        if (!Process.player) {
            hide2show(".container");
        }
        Process.player = x.id;
        Process.level = x.level;
        Process.name = x.name;
        document.title = x.name + " - MUD游戏";
        Setting.load(x.setting);
        onLogin();
        //var panel = $(".player-panel").html(CreateHeadPanel(x));

    }, levelup: function (x) {
        Process.level = x.level;
    },

    selectItem: function (e) {
        if ($(e.target).is(".status-item")) {
            var sid = e.target.getAttribute("sid");
            let pid = $(e.target).closest('.room-item').attr('itemid');
            if (!sid) return;
            if (pid === Process.player)
                return SendCommand("status " + sid);
            return SendCommand("status " + sid + " " + pid);
        }
        var id = $(this).attr("itemid");
        console.log(id);
        if (id) {
            if (id == Process.player) {
                var name = $(this).find(".item-name").html();

                var cmds = [{cmd: "look " + id, name: "查看"},
                    {cmd: "dazuo", name: "打坐"},
                    {cmd: "liaoshang", name: "疗伤"}];
                if (Dialog.team.items && Dialog.team.items.length) {
                    cmds.push({cmd: "team out", name: "退出队伍"});
                    if (Dialog.team.isCap) {
                        cmds.push({cmd: "team dismiss", name: "解散队伍"});
                        cmds.push({cmd: "team set", name: "更改分配方式"});
                    }
                }
                Process.item({
                    id: id,
                    name: name,
                    me: 1,
                    desc: name,
                    commands: cmds
                });
                return;
            }
            SendCommand("select " + id);
        }
    }, countwidth: function (m1, m2) {
        var w = m1 * 100 / m2;
        if (w < 0) w = 0;
        if (w > 100) w = 100;
        return w;
    }, itemremove: function (data) {
        var item = Combat.STATUS[data.id];
        if (item) {
            // 用 StatusItem_clear 正确注销 _animId 动画，避免闭包引用已移除的 shadow 元素
            Combat.StatusItem_clear(item);
            var div = item.elem.parent();
            if (div.next().is(".item-commands")) {
                div.next().remove();
            }
            div.remove();
            delete Combat.STATUS[data.id];
        }

        Process.cur_room.items.RemoveAt(x => x.id === data.id);
    }, itemadd: function (data) {
        if (Setting.off_plist && data.p && data.id != Process.player) {
            return;
        }
        var item = data, player_item;
        if (!Setting.item_firstme && item.id == Process.player) {

            player_item = $(Process.create_roomitem(item)).prependTo(Process.itemsElement);
        } else {
            player_item = $(Process.create_roomitem(item)).appendTo(Process.itemsElement);
        }
        if (Combat.STATUS[data.id]) Process.itemremove(data);
        Combat.AppendStatusItem(item.id, player_item.find(".item-status-bar"), item.status);
        Process.cur_room.items.push(item);
        Combat._resetCDAnimations();
    }
    , items: function (room) {
        // 先清理所有状态动画，再清空 DOM，避免 tick 引用已移除的 shadow 元素
        for (var sid in Combat.STATUS) {
            Combat.StatusItem_clear(Combat.STATUS[sid]);
        }
        Combat.STATUS = {};//更换房间，状态信息清空
        Process.itemsElement.empty();
        for (var i = 0; i < room.items.length; i++) {
            var item = room.items[i];
            if (!item) continue;
            item.player = item.p;
            if (item.m) {
                item.type = '师父';
                item.master = 1;
            }
            if (item.f) {
                item.type = '随从';
                item.follower = 1;
            }
            if (item.l) {
                item.type = '商人';
                item.trader = 1;
            }
            if (Setting.off_plist && item.p && item.id != Process.player) {
                continue;
            }
            var player_item;
            if (!Setting.item_firstme && item.id == Process.player) {

                player_item = $(Process.create_roomitem(item)).prependTo(Process.itemsElement);
            } else {
                player_item = $(Process.create_roomitem(item)).appendTo(Process.itemsElement);
            }
            Combat.AppendStatusItem(item.id, player_item.find(".item-status-bar"), item.status);
        }
        if (!Process.cur_room) Process.cur_room = {};
        Process.cur_room.items = room.items;
        Combat._resetCDAnimations();
    },

    get_hpnum: function (hp, max_hp) {
        var diff = hp / max_hp;
        if (diff > 0.8) return "<hiy>" + hp + "</hiy>";
        if (diff > 0.5) return "<yel>" + hp + "</yel>";
        if (diff > 0.2) return "<red>" + hp + "</red>";
        return "<hir>" + hp + "</hir>";
    }, create_roomitem: function (item) {
        var str = [];

        str.push("<div class='room-item' itemid='" + item.id + "'>");
        if (item.max_hp) {
            str.push('<div class="item-status"');
            if (!Combat.IsShow || Setting.off_hp) {
                str.push(' style="display:none;"');
            }

            str.push('>');
            str.push('<div class="progress hp"><div class="progress-bar" max="' + item.max_hp + '"  style="width:' + Process.countwidth(item.hp, item.max_hp) + '%"></div></div>');
            str.push('<div class="progress mp"><div class="progress-bar" max="' + item.max_mp + '"   style="width:' + Process.countwidth(item.mp, item.max_mp) + '%"></div></div>');
            str.push("</div>");
        }
        str.push("<span class='item-status-bar'>");

        str.push('</span>');


        str.push("<span class='item-name'>");
        str.push(item.name);
        if (Setting.show_hpnum && item.max_hp) {

            str.push('<span class="progress-num">['
                + this.get_hpnum(item.hp, item.max_hp) + "<nor>/</nor><hiy>" + item.max_hp + '</hiy>]</span>');
        }

        str.push('</span>');
        str.push("</div>");
        return str.join("");
    },
    room: function (room) {
        $(".room_items").html("");
        $(".room-name").html(room.name);
        $(".room_desc").html(room.desc);
        Process.room_name = room.name;
        if (Setting.keep_msg) {
            Process.message.clear();
        } else if (!Setting.keep_msg) {
            ReceiveMessage("你来到了" + room.name + "。");
        }
        if (Process.room_path == room.path) return;
        if (Setting.show_roomitem) {
            Process.searchItems(room);
        }

        Combat.ShowRoomCommands(room);

        Process.room_path = room.path;
        Process.cur_room = room;
        MAP.SetRoom(room);
    }, roomHiddenItemsReg: /<\w{3}\scmd=['"](.+?)['"]>(.+?)<\/\w{3}>/g,
    searchItems: function (room) {

        var result = null, roomdesc = room.desc;
        while ((result = this.roomHiddenItemsReg.exec(roomdesc)) !== null) {

            room.commands.push({
                cmd: result[1],
                name: result[2]
            });
        }


    }, exits: function (room) {
        var items = room ? room.items : Process.room_exits;
        if (!items) return;
        Process.room_exits = items;
        if (Setting.exits_dir == 1) {
            var str = ["这里明显的出口有："];
            var exits = [];
            for (var i = 0; i < MAP.DIRS.length; i++) {
                if (items[MAP.DIRS[i]]) {
                    exits.push(MAP.DIRS[i]);
                }
            }
            for (var i = 0; i < exits.length; i++) {
                if (i > 0) {
                    str.push(i == exits.length - 1 ? " 和 " : "、");
                }
                str.push("<span class='exits-item' dir='" + exits[i] + "'>" + exits[i] + "</span>");
            }
            if (exits.length) {
                $(".room_exits").html(str.join(""));
            } else {
                $(".room_exits").html("<HIK>这里没有明显的出口。<HIK>");
            }
        } else {
            $(".room_exits").html(MAP.CreateExitsMap(items, $(".container").width(), Process.room_name))
        }

    },
    before_click_exits: function (e) {
        var elem = $(e.target);
        if (!elem.attr("dir")) return;
        if (elem.is("rect"))
            elem.attr("fill", "gray");
        else if (elem.is("text"))
            elem.prev().attr("fill", "gray");
    },
    click_exits: function (e) {
        var elem = $(e.target);
        var dir = elem.attr("dir");
        if (!dir) return;
        if (elem.is("rect"))
            elem.attr("fill", "#232323");
        else if (elem.is("text"))
            elem.prev().attr("fill", "#232323");
        SendCommand("go " + dir);
    }, query_rmitem: function (id) {
        for (let item of this.cur_room.items) {
            if (item.id === id) return item;
        }
    },
    item: function (item) {
        ReceiveMessage(item.desc);
        item.commands = item.commands ?? [];
        let npc = Process.query_rmitem(item.id);
        if (npc) item = Object.assign(item, npc);

        SCRIPT.LAST_OBJ = item;
        Dialog.extend.append(item.commands, 'item', item);
        var html = ["<div class='item-commands'>"];
        for (var i = 0; i < item.commands.length; i++) {
            html.push("<span cmd='" + item.commands[i].cmd + "'>");
            html.push(item.commands[i].name);
            html.push("</span>");
        }
        html.push("</div>");
        if (!Setting.show_command && Combat.STATUS[item.id]) {
            Process.itemsElement.find(".item-commands").remove();
            var roomitem = Combat.STATUS[item.id].elem.parent();
            $(html.join("")).insertAfter(roomitem);

            return Process.message.scroll2end();
        }
        ReceiveMessage(html.join(""));
    },
    actions: function (data) {
        Combat.ShowActions(data);
    }, cmds: function (data) {
        if (!data.items) return;
        if (Setting.float_dialog == 1) {
            var text = Process._lastMessageText || '';
            Process._lastMessageText = '';
            if (Setting.float_archive == 1 && text) {
                // Remove all lines that were brought into the float dialog
                var lines = text.split('\n');
                for (var li = 0; li < lines.length; li++) {
                    Process.message.pop();
                }
            }
            FloatDialog.add(text, data);
            return;
        }
        var html = ["<div class='item-commands'>"];
        if (!data.items.length) data.items = [data.items];
        for (var i = 0; i < data.items.length; i++) {
            html.push("<span cmd='" + data.items[i].cmd + "'>");
            html.push(data.items[i].name);
            html.push("</span>");
        }
        html.push("</div>");
        ReceiveMessage(html.join(""));
    }
    , map: function (x) {
        MAP.SetMapBuffer(x.map, x.path);
        MAP.ShowMap(x.map, x.path);
    }, updatemap: function (x) {
        MAP.UpdateMap(x.map, x);
    }, dialog: function (data) {
        Dialog.show(data.dialog, data);
    }, sc: function (data) {
        Combat.StatusChanged(data);
    }, perform: function (data) {
        Combat.ShowPFM(data);
    }, disobj: function (data) {
        Combat.DisObj(data);
    }, changepfm: function (data) {
        Combat.ChangeDistime(data);
    }, clearDistime: function (data) {
        Combat.ClearDistime(data);
    }, setDistime: function (data) {
        Combat.SetDistime(data);
    }, pay: function (data) {
        if (data.pay === 3) {//wxqr
            ReceiveMessage('<yel>请打开微信扫描二维码支付：</yel>\n');
            let div = $('<div style="width:100%;text-align:center;"><img style="border:solid 2px #808088" src="' + data.url + '"/></div>');

            div.children(0).on('load', function () {
                ReceiveMessage("");
            });
            MessagePage.append(div);
        } else {
            window.location.href = data.url;
        }
    },
    dispfm: function (data) {

        Combat.On_Perform(data);
    }, status: function (data) {
        Combat.StatusItemChanged(data);
    },
    combat: function (data) {
        if (data.start) {
            if (Setting.auto_showcombat == 1 && !Combat.IsShow) {
                Combat.Show();
            }
            if (Setting.auto_hideroom == 1) {
                if (!Setting.hide_roomdesc) {
                    $(".room_desc").hide();
                }
            }
        }
        if (data.end) {
            if (Setting.auto_hideroom == 1) {
                if (!Setting.hide_roomdesc) {
                    $(".room_desc").show();
                }
            }
        }
        // 新格式战斗文本：服务端只发第三人称，客户端根据 A/T 判断视角
        if (data.s) {
            var s = data.s;
            if (data.A && data.A === Process.name) s = s.split(data.A).join('你');
            if (data.T && data.T === Process.name) s = s.split(data.T).join('你');
            Process.message.push(s);
            Process.message.scroll2end();
        }
    }, state: function (data) {
        if (data && data.state) {

            var ary = ["<span class='title'>" + data.state + "</span>"];
            if (data.commands) {
                // ary.push("<div class='item-commands'>");
                for (var i = 0; i < data.commands.length; i++) {
                    ary.push("<span class='item-command' cmd='" + data.commands[i].cmd + "'>");
                    ary.push(data.commands[i].name);
                    ary.push("</span>");
                }
                // ary.push("</div>");
            }
            $(".state-bar").html(ary.join("")).css('visibility', 'visible');

            if (data.no_stop) $(".state-tool").hide();
            else $(".state-tool").show();
            Process.states = data.desc;
            if (Process.timer) clearInterval(Process.timer);
            if (Process.states && Process.states.length) {
                if (typeof Process.states == "string") {
                    Process.states = [Process.states];
                }
                Process.timer = setInterval(Process.updatestate, data.interval || 5000);
            }
        } else {
            $(".state-bar").empty().css('visibility', 'hidden');
            $(".state-tool").hide();
            clearInterval(Process.timer);
        }
    }, updatestate: function () {
        if (Process.states && isConnected()) {
            var length = Process.states.length;
            ReceiveMessage(Process.states[parseInt(Math.random() * length)]);
        }
    }, die: function (data) {
        if (data.relive) {
            return Process.state({});
        }
        Process.state({
            state: "<hiw>你已经死亡：</hiw>",
            no_stop: true,
            desc: ["<blk>一股阴冷的气息包围着你。</blk>", "<blu>朦胧中你好像听到有人在喊：过来吧，过来吧！</blu>"],
            commands: data.commands,
            interval: 12000
        });

    }, warn: function (data) {
        Warn.Show(data);
    }, msg: function (data) {
        var msg = Dialog.channel.createElement(data, !Setting.no_spmsg);
        if (!msg) return;
        if (!Setting.no_spmsg) {
            Process.channel.push(msg);
            Process.channel.scroll2end();
        } else {
            ReceiveMessage(msg);
        }
    }, addAction: function (data) {
        Combat.AddObj(data.id, data.name, data.distime);
    }, removeAction: function (data) {
        Combat.DisObj({id: data.id, remove: true});
    }
};

function ReceiveMessage(x) {
    Process.message.push(x);
    Process.message.scroll2end();
}

// ============================================================
// 二进制帧解析
// ============================================================

/** 读取嵌套模板引用，递归 format 返回展开字符串 */
function readTplRef(data, pos) {
    const refTid = (data[pos] << 8) | data[pos + 1]; pos += 2;
    const refArgc = data[pos++];
    const refArgMask = data[pos++];
    const refFloatMask = data[pos++];
    const refArgs = [];
    for (let i = 0; i < refArgc; i++) {
        if (refArgMask & (1 << i)) {
            if (refFloatMask & (1 << i)) {
                const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
                refArgs.push(String(dv.getFloat64(pos)));
                pos += 8;
            } else {
                const r = readVarint(data, pos);
                refArgs.push(String(r.value));
                pos = r.next;
            }
        } else {
            const r = readStr(data, pos);
            refArgs.push(r.str);
            pos = r.next;
        }
    }
    return { str: format(refTid, 0, [], refArgs), next: pos };
}

/** 读取 LEB128 无符号 varint */
function readVarint(data, pos) {
    let value = 0, shift = 0;
    while (true) {
        const b = data[pos++];
        value |= (b & 0x7f) << shift;
        if (!(b & 0x80)) break;
        shift += 7;
    }
    return { value, next: pos };
}

/** 读取一个 UTF-8 字符串：1B 长度 + 数据 */
function readStr(data, pos) {
    const len = data[pos];
    const str = new TextDecoder().decode(data.subarray(pos + 1, pos + 1 + len));
    return { str, next: pos + 1 + len };
}

/** 计数 mask 中低于 bit 的置位数（用于计算 sparse 数组索引） */
function popcntBelow(mask, bit) {
    let n = 0, b = 1;
    while (b < bit) {
        if (mask & b) n++;
        b <<= 1;
    }
    return n;
}

/**
 * 解析并分发二进制帧
 * @param {Uint8Array} data
 */
/** 玩家 HP 缓存（用于本地计算 damage） */
const _prevHP = {};

export function ProcessBinary(data) {
    let pos = 0;
    const myName = Process.name || '';

    // 0xFE 为批处理合并帧标记，立刻发送的单帧无此标记
    const isBatch = data[0] === 0xFE;
    if (isBatch) pos = 1;

    while (pos < data.length) {
        const op = data[pos++];
        switch (op) {
            case 0x12: { // combat/room
                const tid = (data[pos] << 8) | data[pos + 1]; pos += 2;
                const mask = data[pos++];

                // 按掩码读取字段（只读置位的字段）
                const sparse = [];
                let bit = 1;
                for (let i = 0; i < 8; i++) {
                    if (mask & bit) {
                        const r = readStr(data, pos);
                        sparse.push(r.str);
                        pos = r.next;
                    }
                    bit <<= 1;
                }

                // 读 ^args（模板引用、整数 varint，浮点 float64，字符串 len+utf8）
                const argCount = data[pos++];
                const argMask = data[pos++];
                const floatMask = data[pos++];
                const refMask = data[pos++];
                const args = [];
                for (let i = 0; i < argCount; i++) {
                    if (refMask & (1 << i)) {
                        const r = readTplRef(data, pos);
                        args.push(r.str);
                        pos = r.next;
                    } else if (argMask & (1 << i)) {
                        if (floatMask & (1 << i)) {
                            const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
                            args.push(String(dv.getFloat64(pos)));
                            pos += 8;
                        } else {
                            const r = readVarint(data, pos);
                            args.push(String(r.value));
                            pos = r.next;
                        }
                    } else {
                        const r = readStr(data, pos);
                        args.push(r.str);
                        pos = r.next;
                    }
                }

                // 模板还原 + 视角转换
                let text = format(tid, mask, sparse, args);
                if (text) {
                    const aName = (mask & 1) ? sparse[popcntBelow(mask, 1)] : '';
                    // 去重：只在批处理合并帧中跳过以自己为主视角的帧（立刻发送的单帧不跳过）
                    if (isBatch && aName === myName) break;
                    const tName = (mask & 0x20) ? sparse[popcntBelow(mask, 0x20)] : '';
                    text = perspective(text, aName, tName, myName);
                    if (Setting.show_binary) text += ' <hib>(binary)</hib>';
                    Process.message.push(text);
                    Process.message.scroll2end();
                }
                break;
            }
            case 0x53: { // SC: HP/MP 状态变更 (notify_hp_b)
                const flags = data[pos++];

                // 解码玩家 ID (7 字节: 前4字符 24bit + hex时间戳 int32)
                const ID_CHARS = '0123456789abcdefghijklmnopqrstuvwxwz';
                const first4 = (data[pos] << 16) | (data[pos + 1] << 8) | data[pos + 2];
                pos += 3;
                const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
                const ts = dv.getInt32(pos);
                pos += 4;
                const id = ID_CHARS[(first4 >> 18) & 0x3F]
                         + ID_CHARS[(first4 >> 12) & 0x3F]
                         + ID_CHARS[(first4 >> 6) & 0x3F]
                         + ID_CHARS[first4 & 0x3F]
                         + ts.toString(16);

                // 读取 float64 值
                const sc = { id };
                if (flags & 0x01) { sc.hp = dv.getFloat64(pos); pos += 8; }
                if (flags & 0x02) { sc.max_hp = dv.getFloat64(pos); pos += 8; }
                if (flags & 0x04) { sc.mp = dv.getFloat64(pos); pos += 8; }
                if (flags & 0x08) { sc.max_mp = dv.getFloat64(pos); pos += 8; }
                if (flags & 0x10) { sc.damage = dv.getFloat64(pos); pos += 8; }
                // 服务端不再逐玩家发送 damage，客户端本地计算
                if (Setting.show_damage && (flags & 0x01) && !(flags & 0x10)) {
                    const prev = _prevHP[id];
                    if (prev !== undefined && prev > sc.hp) {
                        sc.damage = prev - sc.hp;
                    }
                    _prevHP[id] = sc.hp;
                }

                Process.sc(sc);
                break;
            }
            case 0x00: { // raw text fallback
                const r = readStr(data, pos);
                ReceiveMessage(r.str);
                pos = r.next;
                break;
            }
            default:
                // 未知 opcode：跳过
                return;
        }
    }
}

export default Process;
