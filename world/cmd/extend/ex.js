import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "ex";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    admin = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, type) {
    return false;
}
    append_sklf(env) {

}
    on_enter_fb(me, env) {

}
}
