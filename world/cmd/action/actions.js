import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "actions";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, type) {
    //if (!me.actions_changed) return ;
    var str = ["{type:\"actions\",actions:["];
    var items = me.items;

    for (var i = 0; i < items.length; i++) {
        if ((items[i].showAction && !items[i].is_equipment) || items[i].is_shortcut) {
            if (str.length > 1) str.push(",");
            str.push("{cmd:\"use ");
            str.push(items[i].id);
            str.push("\",name:\"");
            str.push(items[i].name);
            str.push("\"");
            if (items[i].distime) {
                str.push(",distime:");
                str.push(items[i].distime);
            }
            str.push("}");
        }
    }
    for (var i = 0; i < me.equipment.length; i++) {
        if (me.equipment[i] && me.equipment[i].on_use) {
            if (str.length > 1) str.push(",");
            str.push("{cmd:\"use ");
            str.push(me.equipment[i].id);
            str.push("\",name:\"");
            str.push(me.equipment[i].name);
            str.push("\"");
            if (me.equipment[i].distime) {
                str.push(",distime:");
                str.push(me.equipment[i].distime);
            }
            str.push("}");
        }
    }
    str.push("]}");
    me.send(str.join(""));
}
}
