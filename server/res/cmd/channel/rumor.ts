import { COMMAND } from "../../../core/command.js";
import { WORLD } from "../../../core/world.js";
import type { USER } from "../../../core/char/user.js";

export default class extends COMMAND {
  command = "rumor";
  allow_busy = true;
  allow_state = true;

  /**
   * @param me - 执行命令的角色
   */
  enter(me: USER, msg: string) {
    if (me) return;
    var msg = JSON.stringify({ type: "msg", ch: "rumor", content: msg });
    WORLD.sendAll(msg);
  }
}
