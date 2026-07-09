import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import type { USER } from "../../../core/char/user.js";
import { NPC } from "../../../core/char/npc.js";

export default class extends COMMAND {
  command = "list";

  /**
   * @param {CHARACTER} me - 执行命令的角色
   */
  enter(me: USER, arg: string) {
    let target: NPC;
    if (!arg) {
      return me.notify("你要看谁的货物。");
    }
    const new_target = me.find_obj(arg, me.environment);
    if (!new_target || !new_target.check_character()) {
      return me.notify("这里没有这个人。");
    }
    if (!new_target.check_npc()) {
      return me.notify(new_target.name + "不是商人。");
    }
    target = new_target;

    let selllist = target.sell_list;
    if (target.on_sell) {
      selllist = target.on_sell(me);
    }
    if (!selllist) {
      return me.notify(target.name + "不出售任何东西。");
    }
    var str = ['{"type":"dialog","dialog":"list","selllist":['];
    for (let i = 0; i < selllist.length; i++) {
      if (i > 0) str.push(",");
      var item = selllist[i];

      str.push(item.format_to_sell());
    }
    str.push("]");
    //,items: [
    //items = me.items;
    //if (items) {
    //    for (var i = 0; i < items.length; i++) {
    //        var item = items[i];
    //        if (i > 0) str.push(",");
    //        str.push('{name:"');
    //        str.push(item.color_name);
    //        str.push('",id:"');
    //        str.push(item.id);
    //        str.push('",count:');
    //        str.push(item.count);
    //        str.push(',unit:"');
    //        str.push(item.unit);
    //        str.push('"}');
    //    }
    //}
    str.push(',title:"');
    str.push(target.name);
    str.push('正在贩卖以下物品："');

    str.push(',seller:"');
    str.push(target.id);
    str.push('"}');

    me.send(str.join(""));
  }
}
