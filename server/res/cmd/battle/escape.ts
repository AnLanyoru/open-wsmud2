import {COMMAND} from "../../../core/command.js";
import {CHARACTER} from "../../../core/char/character.js";
import type { USER } from "../../../core/char/user.js";

export default class extends COMMAND {
    command = "escape";

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me: USER) {

        if (!me.fight_type) {
            return me.notify("你现在没有在战斗，逃跑干嘛？");
        }
        me.do_escape();
    }
}
