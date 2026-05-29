import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "ask";
    regex = /^(\w+)\s+about\s+(.+)$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, objid, par) {
    var obj = me.find_obj(objid, me.environment);
    if (!obj || !obj.on_ask) return me.notify("你要问谁什么？");
    if (!par || par.length>10) return me.notify("你要问什么？");
    par = UTIL.htmlEncode(UTIL.replace_word(par));
  
    me.send_room("$N向$n打听有关「" + par + "」的问题。", obj);
    if (obj.on_ask(me, par) != false) return;
    me.send_room(ask_dunno.random(), obj);
}
}

const UTIL = globalThis.UTIL;
const NPC = globalThis.NPC;
var ask_dunno = ["$n摇摇头，说道：没听说过。",
    "$n睁大眼睛望着$N，显然不知道$P在说什么。",
    "$n耸了耸肩，很抱歉地说：无可奉告。",
    "$n说道：嗯....这我可不清楚，你最好问问别人吧。",
    "很显然，$n根本不想回答$P的问题。",
    "$n想了一会儿，说道：对不起，你问的事我实在没有印象。",
    "$n睁大眼睛望着$N，这么简单的问题也要问吗？",];
NPC.prototype.set_ask = function (name, func) {
    if (!this.question) this.question = {};
    this.question[name] = func;
}
NPC.prototype.on_ask = function (me, par) {
    if (!this.question) return;
    var item = this.question[par];
    if (!item) return;
    return item.call(this,me);
}
