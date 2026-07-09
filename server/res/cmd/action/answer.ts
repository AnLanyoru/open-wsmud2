import { COMMAND } from "../../../core/command.js";
import { USER } from "../../../core/char/user.js";
import type { NPC } from "../../../core/char/npc.js";

export default class extends COMMAND {
  command = "answer";
  regex = /^(\w+)(?:\s+(\w+))$/;
  allow_busy = true;

  /**
   * @param me - 执行命令的角色
   */
  enter(me: USER, objid: string, par: string) {
    var obj = me.find_obj(objid, me.environment);

    if (!obj || !obj.check_npc() || !obj.on_answer)
      return me.notify("你要回答什么？");

    obj.on_answer(me, par);
  }
}

USER.prototype.send_question = function (
  npc: NPC,
  list: string[],
  callbacks: (me: USER, par: string) => void,
) {
  if (!list || !Array.isArray(list)) return;

  let str = ['<div class="sel">'];
  for (let i = 0; i < list.length; i++) {
    if (str.length > 1) str.push("\n");
    str.push(
      (i + 1).toString(),
      "、",
      '<cmd cmd="answer ',
      npc.id,
      " ",
      (i + 1).toString(),
      '">',
      list[i],
      "</cmd>",
    );
  }
  str.push("</div>");
  this.send(str.join(""));
  npc.on_answer = callbacks;
};
