import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "trade";
    allow_fight = false;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, arg) {
    if (!arg) return;
    var target = me.find_obj(arg, me.environment);
    if (!target) {
        return me.notify("这里没有这个人。");
    }
    if (target.is_player) return me.notify("你不能和玩家交易。");
    me.send('{"type":"dialog","dialog":"trade",target:"' + target.id + '",name:"' + target.name + '"}');
}
}
