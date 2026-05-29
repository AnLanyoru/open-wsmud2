import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "recover";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    admin = true;
    regex = /^(.+?)(?:\s(\w+))?$/;
    allow_level = 6;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, userid, objid) {

}
    clear(user) {

}
    add_obj(me, obj, type, key) {

}
}
