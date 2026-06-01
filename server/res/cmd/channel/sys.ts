import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { WORLD } from "../../../core/world.js";
import { UTIL } from "../../../core/util/util.js";

export default class extends COMMAND {
    command = "sys";
    allow_busy = true;
    allow_state = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, msg) {
    if (me) return;
    //if (!msg) {
    //    return;
    //}
    //msg = UTIL.htmlEncode(msg);
    var msg = JSON.stringify({ type: "msg", ch: "sys", content: msg });

    WORLD.sendAll(msg);


}
}

