import {COMMAND} from "../../../core/command.js";
import {CHARACTER} from "../../../core/char/character.js";
import type { USER } from "../../../core/char/user.js";

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
    enter(me: USER, userid: string, objid: string) {

    }

    clear(user) {

    }

    add_obj(me, obj, type, key) {

    }
}
