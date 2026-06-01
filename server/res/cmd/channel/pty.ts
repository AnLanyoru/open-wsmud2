import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";

export default class extends COMMAND {
    command = "pty";
    allow_busy = true;
    allow_state = true;
    allow_die = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, str) {
    if (!str) return;
    if (str.length > 200) return me.notify("你说的太多了。");
    if (me.query_temp("no_chat")) return me.notify("你目前被禁言中。");
    if (me.query_setting("off_pty")) return me.notify("你目前禁止帮派频道中。");
    if (me.query_temp("chat")) return me.notify("你说话速度太快了。");
    if (!me.query_temp("pt")) return me.notify("你还没加入过帮派。");

    var pt = WORLD.DATA.parties.get(me.query_temp("pt"));
    if (!pt) me.notify("没有这个帮派。");

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
    msg = JSON.stringify({ type: "msg", ch: "pty", content: msg, uid: me.id, name: name })
    for (var i = 0; i < pt.roles.length; i++) {
        var user = pt.roles[i].user;
        if (user && !user.query_setting("off_pty")) {
            user.send(msg);
        }
    }
    me.set_temp('chat', 1, 5000);
    me.add_temp('chat2', 1, UTIL.diff_time());
}
}

