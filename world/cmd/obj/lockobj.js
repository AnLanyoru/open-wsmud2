import { COMMAND } from "../../../os/command.js";
import { CHARACTER } from "../../../os/char/character.js";

export default class extends COMMAND {
    command = "lockobj";
    allow_busy = true;
    allow_state = true;
    allow_die = true;
    allow_faint = true;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, objid) {
    var obj = me.find_obj(objid);
    if (!obj) {
        return me.notify("你要锁定什么东西？");
    }
    if (obj.is_locked) {
        obj.is_locked = false;
        me.send(`{type:"dialog",dialog:"pack",id:"${obj.id}",locked:0}`);
        return me.send('<cyn>取消' + obj.color_name + "的锁定状态，你可以进行丢弃，贩卖，分解操作。</cyn>");
    }
    obj.is_locked = true;
    me.send('<hic>设置' + obj.color_name + "为锁定状态，将禁止丢弃，贩卖，分解操作。</hic>\n");
    me.send(`{type:"dialog",dialog:"pack",id:"${obj.id}",locked:1}`);
}
}
