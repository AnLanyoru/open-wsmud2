import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import type { USER } from "../../../core/char/user.js";

export default class extends COMMAND {
  command = "party";
  allow_busy = true;
  allow_state = true;
  allow_die = true;
  admin = true;
  regex = /^(\w+)(?:\s+(.+?))?(?:\s+(\w+))?$/;

  /**
   * @param {CHARACTER} me - 执行命令的角色
   */
  enter(me: USER, cmd: string, par: string, par2: string) {}

  on_user_login(me, is_something) {}
}
