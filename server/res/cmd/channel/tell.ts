import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";

export default class extends COMMAND {
    command = "tell";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    regex = /^(\w+)\s(.+)$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, target, cont) {

}
}
