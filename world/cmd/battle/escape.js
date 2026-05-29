import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "escape";

    enter(me) {

    if (!me.fight_type) {
        return me.notify("你现在没有在战斗，逃跑干嘛？");
    }
    me.do_escape();
}
}
