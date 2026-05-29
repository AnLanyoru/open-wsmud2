import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

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

const WORLD = globalThis.WORLD;
const UTIL = globalThis.UTIL;
