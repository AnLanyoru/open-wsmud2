import { COMMAND } from "../../../os/command.js";

export default function() {
this.inherits(COMMAND);
this.command = "trade";
this.allow_fight = false;
this.enter = function (me, arg) {
    if (!arg) return;
    var target = me.find_obj(arg, me.environment);
    if (!target) {
        return me.notify("这里没有这个人。");
    }
    if (target.is_player) return me.notify("你不能和玩家交易。");
    me.send('{"type":"dialog","dialog":"trade",target:"' + target.id + '",name:"' + target.name + '"}');
}
}
