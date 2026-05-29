import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "recobj";

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, objid) {

    return me.send('你没有可供恢复的道具和操作');

}
}
