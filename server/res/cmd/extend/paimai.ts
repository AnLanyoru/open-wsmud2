import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";

export default class extends COMMAND {
    command = "pm";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    admin = true;
    regex = /^(\w+)(?:\s(\w+))?(?:\s(\w+))?$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, type, par, par2) {
    return me.send('未开放');
}
}
