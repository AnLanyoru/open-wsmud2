import { COMMAND } from "../../../os/command.js";

export default function() {
    const WORLD = globalThis.WORLD; const UTIL = globalThis.UTIL;
this.inherits(COMMAND);
this.command = "fam";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.enter = function (me, str) {
    if (!str) return;
    if (str.length > 200) return me.notify("你说的太多了。");
    if (me.query_temp("no_chat")) return me.notify("你目前被禁言中。");
    if (me.query_setting("off_fam")) return me.notify("你目前禁止门派频道中。");
    if (me.query_temp("chat")) return me.notify("你说话速度太快了。");
    var msg = "";
    var name = me.name;
    if (str[0] == "*") {
        str = str.substr(1);
        msg = WORLD.COMMANDS["emote"].enter(me, str);
        if (!msg) {
            msg = UTIL.htmlEncode(str);
            msg = UTIL.replace_word(str);
        } else {
            name = "";
        }

    } else {
        msg = UTIL.htmlEncode(UTIL.replace_word(str));
    }
  
    msg = JSON.stringify({ type: "msg", ch: "fam", content: msg, uid: me.id, name: name, fam: me.family.name })
    for (var i = 0; i < WORLD.USERS.length; i++) {
        if (WORLD.USERS[i].family == me.family && !WORLD.USERS[i].query_setting("off_fam"))
            WORLD.USERS[i].send(msg);
    }
    me.set_temp('chat', 1, 5000);
    me.add_temp('chat2', 1, UTIL.diff_time());
}
}
