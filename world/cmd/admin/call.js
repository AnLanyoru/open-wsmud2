import { COMMAND } from "../../../os/command.js";

export default function() {
    const WORLD = globalThis.WORLD;
this.inherits(COMMAND);
this.command = "call";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_faint = true;
this.allow_level = 6;
this.regex = /^(?:(\w+)\s)?(.+)$/;
this.enter = function (me, target, arg) {
    try {
        var func = new Function(arg);
        var player = me;
        if (target) {
            player = WORLD.getUser(target);
            if (!player) return me.notify("没有这个玩家");
        }
        func.call(player);
        me.notify("ok");
    } catch (e) {
        console.log(e);
        me.notify("error:" + e);
    }
}
}
