import {COMMAND} from "../../../core/command.js";
import {CHARACTER} from "../../../core/char/character.js";
import type { USER } from "../../../core/char/user.js";

export default class extends COMMAND {
    command = "xiulian";
    allow_fight = false;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: USER) {

    }
}
