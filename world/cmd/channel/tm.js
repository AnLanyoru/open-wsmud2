import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "tm";
    allow_busy = true;
    allow_state = true;
    allow_die = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, str) {
    if (!str) return;
    if (me.query_temp("no_chat")) return me.notify("你目前被禁言中。");
    if (str.length > 200) return me.notify("你说的太多了。");
    var msg = "";
    if (str[0] == "*") {
        str = str.substr(1);
        msg = WORLD.COMMANDS["emote"].enter(me, str);
        if (msg) {
            return   me.send_team(JSON.stringify({ type: "msg", ch: "tm", content: msg, uid: me.id }));
        }
    }

    msg = UTIL.htmlEncode(UTIL.replace_word(str));
    me.send_team(JSON.stringify({ type: "msg", ch: "tm", content: msg, uid: me.id, name: me.name }));
    me.add_temp('chat2', 1, UTIL.diff_time());
}
}

const WORLD = globalThis.WORLD;
const UTIL = globalThis.UTIL;
