import MessageQueue from './message.js';
import { connectServer, hide2show, isConnected, onLogin, SendCommand, showLoader, GameClient } from './client.js';
import Combat from './combat.js';
import Setting from './setting.js';
import MAP from './map.js';
import SCRIPT from './script.js';
import { roles } from './login/index.js';
import { SERVERS } from "./login/server.js";
import FloatDialog from './floatdialog.js';
import { format, ready as templatesReady, getMask, getPartName } from './templates.js';

const MessageContent = () => $(".content-message");
const MessagePage = { append: (div) => $(".content-message").append(div) };

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
        Dialog.skills.skills = null;
        Dialog.skills.playerSkills = Object.create(null);

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
        if (!data.pid) Process.die({ relive: true });
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
        // 兼容 login 消息携带 name（部分服/跨服可能下发）；否则置空占位，房间 items（含玩家自己）到达时在 items() 补全
        Process.name = x.name || "";
        document.title = x.name ? x.name + " - 飘渺江湖" : "飘渺江湖";
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
                var name = $(this).find(".item-name-text").html();

                var cmds = [{ cmd: "look " + id, name: "查看" },
                { cmd: "dazuo", name: "打坐" },
                { cmd: "liaoshang", name: "疗伤" }];
                if (Dialog.team.items && Dialog.team.items.length) {
                    cmds.push({ cmd: "team out", name: "退出队伍" });
                    if (Dialog.team.isCap) {
                        cmds.push({ cmd: "team dismiss", name: "解散队伍" });
                        cmds.push({ cmd: "team set", name: "更改分配方式" });
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
        Process.itemsElement.find(".room-item").filter(function () {
            return $(this).attr("itemid") === data.id;
        }).next(".item-commands").remove().end().remove();

        Process.cur_room.items.RemoveAt(x => x.id === data.id);
    }, itemadd: function (data) {
        if (Setting.off_plist && data.p && data.id != Process.player) {
            return;
        }
        var item = data, player_item;
        Process.itemremove(data);
        if (!Setting.item_firstme && item.id == Process.player) {

            player_item = $(Process.create_roomitem(item)).prependTo(Process.itemsElement);
        } else {
            player_item = $(Process.create_roomitem(item)).appendTo(Process.itemsElement);
        }
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
            // 房间全量 items 必含玩家自己：登录后随玩家数据一次补齐 Process.name 与标题（login 消息不含 name）
            if (item.p && item.id === Process.player && item.name && item.name !== Process.name) {
                Process.name = item.name;
                document.title = item.name + " - 飘渺江湖";
            }
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
        str.push("<span class='item-name-text'>");
        str.push(item.name);
        str.push('</span>');
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
        if (!Array.isArray(data.items)) data.items = [data.items];
        const data_items = data.items
        for (var i = 0; i < data_items.length; i++) {
            const {cmd, name, text, br, group} = data_items[i]
            if (group) html.push("<div class='command-group-title'>", group, "</div>");
            html.push("<span cmd='" + cmd + "'>",
                name,
                "</span>");
            if (text) html.push(text);
            if (br) html.push("<br>")
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
        // 新格式战斗文本：服务端发第三人称 + $P/$p 占位符，客户端根据 A/T 判断视角
        if (data.s) {
            var s = data.s;
            // 解析代词占位符：$P=攻击者代词 $p=目标代词
            // 自身为 A/T 时替换为"你"，否则用服务端提供的第三人称代词
            s = s.split('$P').join(data.A === Process.name ? '你' : (data.P || ''));
            s = s.split('$p').join(data.T === Process.name ? '你' : (data.p || ''));
            if (data.A && data.A === Process.name) s = s.split(data.A).join('你');
            if (data.T && data.T === Process.name) s = s.split(data.T).join('你');
            Process.message.push(s);
            Process.message.flushScroll();
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
        Combat.DisObj({ id: data.id, remove: true });
    }
};

function ReceiveMessage(x) {
    Process.message.push(x);
    Process.message.flushScroll();
}

// ============================================================
// 二进制帧解析
// ============================================================

/** ID 字符集（与服务端 ID_CHARS 一致） */
const ID_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

/** 从 data[pos] 读取 7 字节 ID，返回 { id, next } */
function read7BId(data, pos, dv) {
    const first4 = (data[pos] << 16) | (data[pos + 1] << 8) | data[pos + 2];
    pos += 3;
    const ts = dv.getInt32(pos);
    pos += 4;
    const id = ID_CHARS[(first4 >> 18) & 0x3F]
        + ID_CHARS[(first4 >> 12) & 0x3F]
        + ID_CHARS[(first4 >> 6) & 0x3F]
        + ID_CHARS[first4 & 0x3F]
        + ts.toString(16);
    return { id, next: pos };
}

function lookupCache(id) {
    if (!Process.cur_room || !Process.cur_room.items) return null;
    for (let i = 0; i < Process.cur_room.items.length; i++) {
        if (Process.cur_room.items[i].id === id) return Process.cur_room.items[i];
    }
    return null;
}

/** 按 8 位 fieldMask 从缓存构建 sparse 数组（A 侧字段从 aCache，T 侧从 tCache） */
function buildSparseFromCache(fieldMask, aId, tId) {
    const aCache = aId ? lookupCache(aId) : null;
    const tCache = tId ? lookupCache(tId) : null;
    const sparse = [];
    // FMASK 位顺序: A_NAME(0x01) A_WEAPON(0x02) A_CALL3(0x04) T_WEAPON(0x08) A_THROW(0x10) T_NAME(0x20) [0x40保留] T_CALL3(0x80)
    if (fieldMask & 0x01) sparse.push(aCache ? (aCache.n || aCache.name) : '');           // A_NAME (纯名字)
    if (fieldMask & 0x02) sparse.push(aCache ? (aCache.w || '手') : '手');  // A_WEAPON
    if (fieldMask & 0x04) sparse.push((aId && aId === Process.player) ? '你' : (aCache ? (aCache.c || '') : ''));     // A_CALL3
    if (fieldMask & 0x08) sparse.push(tCache ? (tCache.w || '手') : '手');  // T_WEAPON
    if (fieldMask & 0x10) sparse.push(aCache ? (aCache.th || '') : '');    // A_THROW
    if (fieldMask & 0x20) sparse.push(tCache ? (tCache.n || tCache.name) : '<hir>未知存在</hir>'); // T_NAME (纯名称)
    // 0x40 保留，不消费 sparse
    if (fieldMask & 0x80) sparse.push((tId && tId === Process.player) ? '你' : (tCache ? (tCache.c || '') : ''));     // T_CALL3
    return sparse;
}

/** 按当前玩家视角转换模板中的攻击者/目标名称。每层模板展开后分别调用，避免嵌套模板漏转“你”。 */
function applyMessagePerspective(text, fieldMask, sparse, aId, tId) {
    if (!text) return text;
    // 名字为空字符串时禁止 split('')，否则会在每个字符之间插入“你”
    const aName = (fieldMask & 0x01) ? sparse[popcntBelow(fieldMask, 0x01)] : '';
    const tName = (fieldMask & 0x20) ? sparse[popcntBelow(fieldMask, 0x20)] : '';
    if (aId && aId === Process.player && aName) text = text.split(aName).join('你');
    if (tId && tId === Process.player && tName) text = text.split(tName).join('你');
    return text;
}

/** 读取嵌套模板引用，递归 format 返回展开字符串 */
function readTplRef(data, pos, aId, tId, dv, hurtPart) {
    const refTid = (data[pos] << 8) | data[pos + 1]; pos += 2;
    const refArgc = data[pos++];
    const refArgMask = data[pos++];
    const refFloatMask = data[pos++];
    const refArgs = [];
    for (let i = 0; i < refArgc; i++) {
        if (refArgMask & (1 << i)) {
            if (refFloatMask & (1 << i)) {
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
    // 嵌套模板用自己的 fieldMask 从缓存构建 sparse（缓存有全部字段），复用父级 hurtPart
    const refFieldMask = getMask(refTid);
    const refSparse = buildSparseFromCache(refFieldMask, aId, tId);
    const refText = format(refTid, refFieldMask, refSparse, refArgs, hurtPart);
    return {
        str: applyMessagePerspective(refText, refFieldMask, refSparse, aId, tId),
        next: pos
    };
}

// ============================================================
// 客户端本地生成进出消息（替代服务端 0x56 文本广播）
// ============================================================

/** 方向索引 → 中文名（0=无方向）— 与服务端 go.ts dirs 一致 */
const DIR_NAMES = ['', '北方', '南方', '东方', '西方', '北边', '南边', '东边', '西边',
    '北边', '南边', '东边', '西边', '东北', '西北', '东南', '西南', '上面', '下面', '里面', '外面'];

/** 生成进入消息（与服务端 sendInMessage 逻辑一致） */
function _genInMessage(item, isFighting) {
    const name = item.n || item.name || '';
    if (isFighting) return name + '跌跌撞撞地跑了过来，模样有些狼狈。';
    if (item.hp && item.max_hp) {
        const eq = (item.hp * 100) / item.max_hp;
        if (eq < 5) return name + '撑着满是<HIR>鲜血</HIR>的躯体，一瘸一拐地挪了过来。';
        if (eq < 10) return name + '一边擦着嘴角的<HIR>鲜血</HIR>，一边走了过来，龇牙咧嘴的。';
        if (eq < 30) return name + '灰头土脸、狼狈不堪地走了过来。';
        if (eq < 50) return name + '像斗败了的公鸡，垂头丧气地走了过来。';
    }
    // 面容 + 武器 + 衣着（与服务端原 sendInMessage/getFace 逻辑一致）
    var face = _getFace(item) + '的' + name;
    var weapon = item.w || '';
    if (weapon) face += '手执' + weapon;
    if (item.cl === 0) face += '全身清洁溜溜的';  // cl=0 表示无衣
    return face + '走了过来。';
}

/** 面容描述词表（与服务端原 go.ts face1/face2 一致） */
var _face1 = ['眉歪眼斜', '贼眉鼠眼', '尖嘴猴腮', '相貌平平', '膀大腰圆', '一表人才', '仪表堂堂', '丰神如玉', '气宇不凡', '玉树临风', '风度翩翩'];
var _face2 = ['奇丑无比', '獐头鼠目', '身材干瘦', '相貌平平', '体态轻盈', '亭亭玉立', '面目姣好', '容色秀丽', '风情万种', '清丽绝俗', '美若天仙'];

/** 根据 per（容貌）和 gender（性别）生成面容描述 — 与服务端原 go.ts getFace 一致 */
function _getFace(item) {
    var v = parseInt((item.per || 20) / 4);
    if (item.gender == 1) {
        if (v > _face1.length - 1) v = _face1.length - 1;
        return _face1[v];
    } else {
        if (v > _face2.length - 1) v = _face2.length - 1;
        return _face2[v];
    }
}

/** 生成离开消息（与服务端 sendOutMessage 逻辑一致） */
function _genLeaveMessage(cached, dirIndex, isFighting) {
    const name = cached.n || cached.name || '';
    const d = DIR_NAMES[dirIndex] || '';
    if (isFighting) return name + '往' + d + '落荒而逃了。';
    if (cached.hp && cached.max_hp) {
        const eq = (cached.hp * 100) / cached.max_hp;
        if (eq < 5) return name + '撑起满是<HIR>鲜血</HIR>的躯体，一瘸一拐地朝' + d + '挪去。';
        if (eq < 10) return name + '一边擦着嘴角的<HIR>鲜血</HIR>，一边朝' + d + '走去。';
        if (eq < 30) return name + '灰头土脸、狼狈不堪地向' + d + '离去。';
        if (eq < 50) return name + '一声不吭的转身朝' + d + '走去，脸色好像有些难看。';
    }
    return name + '往' + d + '离开。';
}

/** 读取 LEB128 无符号 varint — 用 BigInt 中间值避免 32 位 << 溢出，转回 number */
function readVarint(data, pos) {
    let value = 0n, shift = 0n;
    while (true) {
        const b = data[pos++];
        value |= BigInt(b & 0x7f) << shift;
        if (!(b & 0x80)) break;
        shift += 7n;
    }
    return { value: Number(value), next: pos };
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
export function ProcessBinary(data) {
    let pos = 0;
    const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);

    // 0xFE 为批处理合并帧标记（所有二进制帧统一走批处理）
    if (data[0] === 0xFE) pos = 1;

    while (pos < data.length) {
        const op = data[pos++];
        // op 高位 0x80 = excludeself 标记（send_room_others_b 编码），低 7 位为真实 op
        const excludeSelf = (op & 0x80) !== 0;
        const realOp = op & 0x7F;
        switch (realOp) {
            case 0x12: { // combat/room — ID-based: 携带 7B A_ID/T_ID + HURT_PART，从 cur_room.items 缓存查字段
                const tid = (data[pos] << 8) | data[pos + 1]; pos += 2;
                const idMask = data[pos++];

                // 读取 7B A_ID / T_ID
                let aId = null, tId = null;
                if (idMask & 0x01) { const r = read7BId(data, pos, dv); aId = r.id; pos = r.next; }
                if (idMask & 0x02) { const r = read7BId(data, pos, dv); tId = r.id; pos = r.next; }
                // 读取内联攻击部位（HURT_PART 位置位时，1B 索引：高4位类型 + 低4位索引）
                let hurtPart = null;
                if (idMask & 0x04) { hurtPart = getPartName(data[pos++]); }

                // 从模板表查 8 位 fieldMask，从缓存构建 sparse
                const fieldMask = getMask(tid);
                const sparse = buildSparseFromCache(fieldMask, aId, tId);

                // 读 ^args（模板引用、整数 varint，浮点 float64，字符串 len+utf8）
                const argCount = data[pos++];
                const argMask = data[pos++];
                const floatMask = data[pos++];
                const refMask = data[pos++];
                const args = [];
                for (let i = 0; i < argCount; i++) {
                    if (refMask & (1 << i)) {
                        const r = readTplRef(data, pos, aId, tId, dv, hurtPart);
                        args.push(r.str);
                        pos = r.next;
                    } else if (argMask & (1 << i)) {
                        if (floatMask & (1 << i)) {
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

                // 模板还原 + 视角转换（用 ID 比较，无名字碰撞风险）
                let text = applyMessagePerspective(
                    format(tid, fieldMask, sparse, args, hurtPart),
                    fieldMask,
                    sparse,
                    aId,
                    tId
                );
                if (text) {
                    // excludeSelf / no_mcmsg：用 A_ID 比较
                    if (excludeSelf && aId === Process.player) break;
                    if (aId === Process.player && Setting.no_mcmsg) break;
                    if (Setting.show_binary) {
                        // 调试输出：字段值来自 cur_room.items 缓存（非帧内下发），帧仅携带 idMask + 7B ID
                        const FIELD_NAMES = ['A_NAME', 'A_WEAPON', 'A_CALL3', 'T_WEAPON', 'A_THROW', 'T_NAME', '(reserved)', 'T_CALL3'];
                        const fields = [];
                        let fbit = 1, sIdx = 0;
                        for (let i = 0; i < 8; i++) {
                            if (fieldMask & fbit) fields.push(`(cache)${FIELD_NAMES[i]}:${sparse[sIdx++]}`);
                            fbit <<= 1;
                        }
                        const opHex = '0x' + (excludeSelf ? 0x92 : 0x12).toString(16);
                        text += ` <hib>(b-${opHex} tid:${tid} idMask:0x${idMask.toString(16)} aId:${aId || '-'} tId:${tId || '-'}${hurtPart ? ' hurtPart:' + hurtPart : ''}${fields.length ? ' ' + fields.join(' ') : ''}${args.length ? ' args:[' + args.join(',') + ']' : ''})</hib>`;
                    }
                    Process.message.push(text);
                    Process.message.scroll2end();
                }
                break;
            }
            case 0x55: { // 脏数据刷新帧 — 更新 cur_room.items 中的 AT 缓存字段
                const count = data[pos++];
                for (let i = 0; i < count; i++) {
                    const r = read7BId(data, pos, dv);
                    const id = r.id;
                    pos = r.next;
                    const fm = data[pos++];
                    const item = lookupCache(id);
                    // 按 FMASK 位顺序读取字段并更新缓存
                    // bit3 (0x08) 现在是 T_WEAPON，与 A_WEAPON 共用缓存字段 w
                    const fieldReaders = [
                        () => { const r = readStr(data, pos); pos = r.next; if (item) item.n = r.str; },            // A_NAME (纯名字，更新缓存 n)
                        () => { const r = readStr(data, pos); pos = r.next; if (item) item.w = r.str; },            // A_WEAPON
                        () => { const r = readStr(data, pos); pos = r.next; if (item) item.c = r.str; },            // A_CALL3
                        () => { const r = readStr(data, pos); pos = r.next; if (item) item.w = r.str; },            // T_WEAPON (同 A_WEAPON 缓存字段 w)
                        () => { const r = readStr(data, pos); pos = r.next; if (item) item.th = r.str; },           // A_THROW
                        () => { const r = readStr(data, pos); pos = r.next; if (item) item.n = r.str; },            // T_NAME (纯名称，独立缓存字段 n)
                        () => { const r = readStr(data, pos); pos = r.next; },                                      // 0x40 保留（不更新缓存）
                        () => { const r = readStr(data, pos); pos = r.next; if (item) item.c = r.str; },            // T_CALL3 (同 A_CALL3)
                    ];
                    const fieldBits = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80];
                    for (let j = 0; j < 8; j++) {
                        if (fm & fieldBits[j]) fieldReaders[j]();
                    }
                }
                break;
            }
            case 0x53: { // SC: HP/MP 状态变更 (notify_hp_b)
                const flags = data[pos++];
                const r = read7BId(data, pos, dv);
                const id = r.id;
                pos = r.next;

                // 读取 float64 值
                const sc = { id };
                if (flags & 0x01) { sc.hp = dv.getFloat64(pos); pos += 8; }
                if (flags & 0x02) { sc.max_hp = dv.getFloat64(pos); pos += 8; }
                if (flags & 0x04) { sc.mp = dv.getFloat64(pos); pos += 8; }
                if (flags & 0x08) { sc.max_mp = dv.getFloat64(pos); pos += 8; }
                if (flags & 0x10) { sc.damage = dv.getFloat64(pos); pos += 8; }
                Process.sc(sc);
                break;
            }
            case 0x54: { // 伤害占比广播 (每100ms 服务端推送分玩家伤害)
                // 读受击单位 id (7B)
                const tr = read7BId(data, pos, dv);
                const targetId = tr.id;
                pos = tr.next;
                const count = data[pos++];
                let myDamage = 0;
                for (let i = 0; i < count; i++) {
                    const ar = read7BId(data, pos, dv);
                    const attackerId = ar.id;
                    pos = ar.next;
                    const r = readVarint(data, pos);
                    pos = r.next;
                    if (attackerId === Process.player) myDamage = r.value;
                }
                if (myDamage > 0) Process.sc({ id: targetId, damage: myDamage });
                break;
            }
            case 0x00: { // raw text fallback
                const r = readStr(data, pos);
                ReceiveMessage(r.str);
                pos = r.next;
                break;
            }
            case 0x56: { // JSON 文本（itemadd/itemremove/移动消息等）— 走 OnData 解析
                const r = readVarint(data, pos);
                pos = r.next;
                const jsonStr = new TextDecoder().decode(data.subarray(pos, pos + r.value));
                pos += r.value;
                try {
                    // 服务端 item_json 输出的是 JS 对象字面量（键名无引号），用 Function 解析兼容
                    const parsed = (new Function('return ' + jsonStr))();
                    if (parsed && parsed.type) {
                        const handler = Process[parsed.type];
                        if (typeof handler === 'function') {
                            if (parsed.type === 'itemremove') {
                                // 离开消息：先查缓存判断是否玩家，再移除
                                const cached = lookupCache(parsed.id);
                                if (cached && cached.p && !Setting.off_move) {
                                    if (parsed.msg) {
                                        ReceiveMessage(parsed.msg);
                                    } else {
                                        ReceiveMessage(_genLeaveMessage(cached, 0, false));
                                    }
                                }
                                handler.call(Process, parsed);
                            } else {
                                handler.call(Process, parsed);
                                // 进入消息：itemadd 后检查 msg，无 msg 时客户端本地生成
                                if (parsed.type === 'itemadd' && parsed.p && !Setting.off_move) {
                                    if (parsed.msg) {
                                        ReceiveMessage(parsed.msg);
                                    } else {
                                        ReceiveMessage(_genInMessage(parsed, false));
                                    }
                                }
                            }
                        }
                    }
                } catch (e) { /* ignore parse error */ }
                break;
            }
            case 0x57: { // 房间人员增量（二进制 itemadd + 客户端生成 in_msg）
                const idR = read7BId(data, pos, dv);
                pos = idR.next;
                const flags = data[pos++];
                const item = { id: idR.id };

                // name (long_name) — 必有
                const nr = readStr(data, pos);
                item.name = nr.str;
                pos = nr.next;

                const isPlayer = (flags & 0x01) !== 0;
                if (isPlayer) item.p = 1;

                if (flags & 0x02) { // has_status
                    let r;
                    r = readVarint(data, pos); pos = r.next; item.mp = r.value;
                    r = readVarint(data, pos); pos = r.next; item.hp = r.value;
                    r = readVarint(data, pos); pos = r.next; item.max_mp = r.value;
                    r = readVarint(data, pos); pos = r.next; item.max_hp = r.value;
                }

                if (flags & 0x04) { // has_combat (w/c/th/n)
                    let r;
                    r = readStr(data, pos); pos = r.next; item.w = r.str;
                    r = readStr(data, pos); pos = r.next; item.c = r.str;
                    r = readStr(data, pos); pos = r.next; item.th = r.str;
                    r = readStr(data, pos); pos = r.next; item.n = r.str;
                }

                if (flags & 0x08) { // has_status_effects
                    const sl = readVarint(data, pos);
                    pos = sl.next;
                    const sJson = new TextDecoder().decode(data.subarray(pos, pos + sl.value));
                    pos += sl.value;
                    try {
                        const parsed = (new Function('return {' + sJson + '}'))();
                        if (parsed.status) item.status = parsed.status;
                    } catch (e) { /* ignore */ }
                }

                if (flags & 0x40) { // has_profile: per(1B) + gender(1B) + cl(1B)
                    item.per = data[pos++];
                    item.gender = data[pos++];
                    item.cl = data[pos++];  // 0=无衣, 1=有衣
                }

                // 读取可选的模板 ID（has_tpl_id = bit5，2 字节）
                let tplId = -1;
                if (flags & 0x20) {
                    tplId = (data[pos] << 8) | data[pos + 1];
                    pos += 2;
                }

                const isFighting = (flags & 0x10) !== 0;
                Process.itemadd.call(Process, item);

                // 只有玩家物件才生成进入消息（避免尸体/掉落物产生虚假消息）
                if (isPlayer && !Setting.off_move) {
                    if (tplId >= 0) {
                        // 复用模板表 + $N 机制：用 item.name 替换 $N
                        const fieldMask = getMask(tplId);
                        const sparse = [item.n || item.name || ''];  // A_NAME = item.name
                        const msg = format(tplId, fieldMask, sparse, null, null);
                        if (msg) ReceiveMessage(msg);
                    } else {
                        ReceiveMessage(_genInMessage(item, isFighting));
                    }
                }
                break;
            }
            case 0x59: {
                const r = read7BId(data, pos, dv);
                pos = r.next;
                const mask = data[pos++];
                const item = lookupCache(r.id);
                if (!item) {
                    for (let i = 0; i < 5; i++) {
                        if (!(mask & (1 << i))) continue;
                        const value = readStr(data, pos);
                        pos = value.next;
                    }
                    break;
                }
                const keys = ['name', 'n', 'w', 'c', 'th'];
                for (let i = 0; i < keys.length; i++) {
                    if (!(mask & (1 << i))) continue;
                    const value = readStr(data, pos);
                    pos = value.next;
                    item[keys[i]] = value.str;
                }
                if (mask & 0x01) {
                    Process.itemsElement.find(".room-item").filter(function () {
                        return $(this).attr("itemid") === r.id;
                    }).find(".item-name-text").html(item.name);
                }
                break;
            }
            case 0x58: { // 房间人员离开（二进制 itemremove + 客户端生成 leave_msg）
                const r = read7BId(data, pos, dv);
                pos = r.next;
                const dirIndex = data[pos++];
                const flags8 = data[pos++];
                const isFighting = (flags8 & 0x01) !== 0;

                // 读取可选的模板 ID（has_tpl_id = bit1，2 字节）
                let tplId = -1;
                if (flags8 & 0x02) {
                    tplId = (data[pos] << 8) | data[pos + 1];
                    pos += 2;
                }

                // 先查缓存获取玩家信息，再移除
                const cached = lookupCache(r.id);
                // 只有玩家物件才生成离开消息（避免尸体/掉落物产生虚假消息）
                if (cached && cached.p && !Setting.off_move) {
                    if (tplId >= 0) {
                        // 复用模板表 + $N 机制：用 cached.name 替换 $N
                        const fieldMask = getMask(tplId);
                        const sparse = [cached.n || cached.name || ''];  // A_NAME = cached.name
                        const msg = format(tplId, fieldMask, sparse, null, null);
                        if (msg) ReceiveMessage(msg);
                    } else {
                        ReceiveMessage(_genLeaveMessage(cached, dirIndex, isFighting));
                    }
                }
                Process.itemremove.call(Process, { id: r.id });
                break;
            }
            default:
                // 未知 opcode：跳过
                return;
        }
    }
    // 批处理帧结束 — 统一触发一次滚动（用 rAF 合并到下一渲染帧）
    Process.message.flushScroll();
}

export default Process;
