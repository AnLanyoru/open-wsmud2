import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "escape";

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me) {

    if (!me.fight_type) {
        return me.notify("你现在没有在战斗，逃跑干嘛？");
    }
    me.do_escape();
}
}
