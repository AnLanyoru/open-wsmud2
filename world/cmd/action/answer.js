import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";
import { USER } from "../../../os/char/user.js";

export default class extends COMMAND {
    command = "answer";
    regex = /^(\w+)(?:\s+(\w+))$/;
    allow_busy = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, objid, par) {
    var obj = me.find_obj(objid, me.environment);

    if (!obj || !obj.on_answer) return me.notify("你要回答什么？");

    obj.on_answer(me, par);
}
}

USER.prototype.send_question = function (npc, list, callbacks) {
    if (!list || !Array.isArray(list)) return;

    let str = ['<div class="sel">'];
    for (let i = 0; i < list.length; i++) {
        if (str.length > 1) str.push('\n');
        str.push(i + 1, '、', '<cmd cmd="answer ', npc.id, ' ', i + 1, '">', list[i], '</cmd>');
    }
    str.push('</div>');
    this.send(str.join(''));
    npc.on_answers = callbacks;
}
