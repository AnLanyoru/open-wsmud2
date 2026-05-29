import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

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

const SKILL = globalThis.SKILL;
const WEAPON_TYPE = globalThis.WEAPON_TYPE;
const USER = globalThis.USER;
