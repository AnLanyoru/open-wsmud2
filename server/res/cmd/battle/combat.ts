import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { SKILL } from "../../../core/skill/skill.js";
import { WEAPON_TYPE } from "../../../core/const.js";
import { USER } from "../../../core/char/user.js";

export default class extends COMMAND {
    command = "combat";
    allow_busy = true;
    allow_state = true;
    allow_die = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, type) {
    if (type=="end") {
        me.combat_info = false;
    } else {
        me.combat_info = true;
       
        //me.notify(me.query_status());
        me.notify(me.query_pfms());
        //if (me.is_fighting()) {
        //    var target = me.enemy[0];
        //    if (target)
        //        me.notify(target.query_status());
        //}
    }
}
}

