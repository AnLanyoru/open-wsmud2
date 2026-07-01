import {COMMAND} from "../../../core/command.js";
import {CHARACTER} from "../../../core/char/character.js";
import type { USER } from "../../../core/char/user.js";
import {WORLD} from "../../../core/world.js";

export default class extends COMMAND {
    command = "pk";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: USER) {
        var zc = WORLD.AREAS[6];

    }
}

