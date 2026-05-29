import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "es";
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
    if (!me.level) return me.notify("你无法发送全区消息");
    if (me.query_temp("no_chat")) return me.notify("你目前被禁言中。");
    if (me.query_temp("chat")) return me.notify("你说话速度太快了。");
    if (me.query_setting("off_es")) return me.notify("你目前禁止全区频道中。");
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
    msg = JSON.stringify({ type: "msg", ch: "es", content: msg, uid: me.id, lv: (me.level || 0), name: name, server: WORLD.SERVER.name });

    for (var i = 0; i < WORLD.USERS.length; i++) {
        if (!WORLD.USERS[i].query_setting("off_es"))
            WORLD.USERS[i].send(msg);
    }
    WORLD.sendAllServer(msg);
    me.set_temp('chat', 1, 5000);
    me.add_temp('chat2', 1, UTIL.diff_time());




}
}

const WORLD = globalThis.WORLD;
const UTIL = globalThis.UTIL;
