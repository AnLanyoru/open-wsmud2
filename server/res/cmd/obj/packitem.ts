import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";

export default class extends COMMAND {
    command = "packitem";
    regex = /^(\w+)\s+(\w+)(?:\s+(\w+))?$/;

    /**
     * @param {CHARACTER} player - 执行命令的角色
     */
    enter(player, cmd, objid, par) {
    var obj = player.find_obj(objid);
    if (!obj) return player.notify("你身上没有这个东西。");


    if (!obj.actions) return player.notify("你要对" + obj.color_name + "做什么？");
    var act = obj.actions[cmd];
    if (!act || !act.action) return player.notify("你要对" + obj.color_name + "做什么？");
    act.action.call(obj, player, par);
}
}
