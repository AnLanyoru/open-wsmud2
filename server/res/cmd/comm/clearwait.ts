import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";

export default class extends COMMAND {
    command = "clearwait";

    /**
     * @param player - 执行命令的角色
     */
    enter(player: CHARACTER) {
    player.wait_input = null;
}
}
