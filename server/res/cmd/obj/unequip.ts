import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import type { USER } from "../../../core/char/user.js";
import type { EQUIPMENT } from "../../../core/item/equipment.js";

export default class extends COMMAND {
  command = "uneq";

  /**
   * @param {CHARACTER} me - 执行命令的角色
   */
  enter(me: USER, oid: string) {
    let obj: EQUIPMENT | null = null;
    if (me.equipment) {
      for (let i = 0; i < me.equipment.length; i++) {
        const eq = me.equipment[i];
        if (eq && eq.id == oid) {
          obj = eq;
          break;
        }
      }
    }
    if (!obj) return me.notify("你要取消装备什么？");

    if (me.unequip(obj) != false && obj.on_use) {
      if (!obj.is_shortcut) obj.notify_action(me, false);
    }
  }
}
