import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { WORLD } from "../../../os/world.js";

export default class extends COMMAND {
    command = "challenge";
    allow_fight = false;

    /**
     * @param {CHARACTER} player - 执行命令的角色
     */
    enter(player, index) {

    return WORLD.COMMANDS['biwu'].biwu_record(player);
}
}

