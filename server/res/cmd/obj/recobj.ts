import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import type { USER } from "../../../core/char/user.js";

export default class extends COMMAND {
  command = "recobj";

  /**
   * @param {CHARACTER} me - 执行命令的角色
   */
  enter(me: USER, objid: string) {
    return me.send("你没有可供恢复的道具和操作");
  }
}
