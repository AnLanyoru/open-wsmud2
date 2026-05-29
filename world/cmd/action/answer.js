import { COMMAND } from "../../../os/command.js";

export default function() {
    const USER = globalThis.USER;
this.inherits(COMMAND);
this.command = "answer";
this.regex = /^(\w+)(?:\s+(\w+))$/;
this.allow_busy = true;
this.enter = function (me, objid, par) {
    var obj = me.find_obj(objid, me.environment);

    if (!obj || !obj.on_answer) return me.notify("你要回答什么？");

    obj.on_answer(me, par);
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
}
