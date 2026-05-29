import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "chat";
    allow_busy = true;
    allow_state = true;
    allow_die = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, str) {
    if (!str) return;
    if (me.master) return;
    if (str.length > 200) return me.notify("你说的太多了。");
    if (me.query_temp("no_chat")) {
        if (me.temp.no_chat.e) {
            let time = new Date(me.temp.no_chat.e);
            return me.notify("你已经被禁言，持续到" + time.getFullYear()
                + "年" + (time.getMonth() + 1) + "月" +
                time.getDate() + "日" + time.getHours() + "时" + time.getMinutes() + "分。");
        }
        return me.notify("你已经被禁言。");
    }
    if (me.query_temp("chat")) return me.notify("你说话速度太快了。");
    if (me.query_setting("off_chat")) return me.notify("你目前禁止公共频道中。");
    //if (me.query_temp("new")) return me.notify("新手训练完成前不能在世界频道发言。");
    if (me.exp < 100000) return me.notify("新注册账号不能在世界频道发言");
    if (!me.name) {
        // WORLD.log(null, me.ip_address || me.userid || "chat", str);
        return;
    }
    var msg = "", name = me.name;
    if (str[0] == "*") {
        str = str.substr(1);
        msg = WORLD.COMMANDS["emote"].enter(me, str);
        if (!msg) {
            msg = UTIL.htmlEncode(str);
            msg = UTIL.replace_word(str);
        }
        else name = "";
    } else {
        msg = UTIL.htmlEncode(UTIL.replace_word(str));
    }
    let content = { type: "msg", ch: "chat", content: msg, uid: me.id, lv: (me.level || 0), name: name };
    if (me.level === 6) {
        let lv6 = me.query_temp('lv6');
        if (lv6) content.lv6 = lv6;
    }
    msg = JSON.stringify(content);
    for (var i = 0; i < WORLD.USERS.length; i++) {
        if (!WORLD.USERS[i].query_setting("off_chat"))
            WORLD.USERS[i].send(msg);
    }
    me.set_temp('chat', 1, 3000);
    //me.add_temp('chat2', 1, UTIL.diff_time());
}
}

const WORLD = globalThis.WORLD;
const UTIL = globalThis.UTIL;
