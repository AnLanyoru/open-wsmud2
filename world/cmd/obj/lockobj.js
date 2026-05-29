import { COMMAND } from "../../../os/command.js";

export default function() {
this.inherits(COMMAND);
this.command = "lockobj";
this.allow_busy = true;
this.allow_state = true;
this.allow_die = true;
this.allow_faint = true;
//this.regex = /^(\d)\s(\w+)$/;
this.enter = function (me, objid) {
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
