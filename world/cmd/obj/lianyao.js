import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "lianyao";
    regex = /^(\w+)?(?:\s(-?\d+))?$/;

    /**
     * @param {CHARACTER} player - 执行命令的角色
     */
    enter(player, arg, id) {

}
}
