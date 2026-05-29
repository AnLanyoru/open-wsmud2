import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";

export default class extends COMMAND {
    command = "call";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;
    allow_level = 6;
    regex = /^(?:(\w+)\s)?(.+)$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, target, arg) {
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

