import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "pk";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me) {
    var zc = WORLD.AREAS[6];

}
}

const WORLD = globalThis.WORLD;
