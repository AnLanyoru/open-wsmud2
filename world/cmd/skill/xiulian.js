import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "xiulian";
    allow_fight = false;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me) {

}
}
