import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import type { USER } from "../../../core/char/user.js";
import { TASK } from "../../../core/task/task.js";

export default class extends COMMAND {
  command = "systask";
  regex = /(\w+)\s+(\w+)?/;

  /**
   * @param {CHARACTER} me - 执行命令的角色
   */
  enter(me: USER, arg: string, par: string) {
    if (!arg) return false;
    var task = TASK.GET(arg);
    if (!task) return false;
    if (me.user_level < 5) {
      if (!ALLOW_COMMANDS.has(par)) return false;
    }
    var func = task[par];
    if (!func) return;
    func.call(task, me);
  }
}

const ALLOW_COMMANDS = new Set(["bm", "reward"]);
