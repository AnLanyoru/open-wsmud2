import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "uneq";

    enter(me, oid) {
    var obj;
    if (me.equipment) {
        for (var i = 0; i < me.equipment.length; i++) {
            if (me.equipment[i] && me.equipment[i].id == oid) {
                obj = me.equipment[i];
                break;
            }
        }
    }
    if (!obj) return me.notify("你要取消装备什么？");

    if (me.unequip(obj) != false && obj.on_use) {
        if (!obj.is_shortcut)
            obj.notify_action(me, false);

    }
}
}
