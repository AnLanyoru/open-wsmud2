import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";

export default class extends COMMAND {
    command = "stopstate";
    allow_busy = true;
    allow_state = true;

    /**
     * @param {CHARACTER} player - 执行命令的角色
     */
    enter(player) {
    if (player.state) {
        if (player.state.no_stop) return player.notify(player.state.no_stop);
    }
    player.set_state(null);
}
}
