import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { UTIL } from "../../../os/util/util.js";

export default class extends COMMAND {
    command = "say";
    allow_busy = true;
    allow_state = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, msg) {

    if (!msg) {
        return me.send_room("$N在自言自语的说些什么。");
    }
    if (me.query_temp("no_chat")) return me.notify("你目前被禁言中。");
    if (msg.length > 200) return me.notify("你说的太多了。");
    if (msg[0] == "/") {
        if (me.query_temp("admin") || me.query_temp("wiz"))
            return me.command(msg.substr(1));
    }
    msg = UTIL.htmlEncode(UTIL.replace_word(msg));
    me.add_temp('chat2', 1, UTIL.diff_time());
    return me.send_room("$N说：" + UTIL.htmlEncode(msg));
}
}

