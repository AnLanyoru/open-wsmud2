import { COMMAND } from "../../../os/command.js";

export default function() {
    const UTIL = globalThis.UTIL;
this.inherits(COMMAND);
this.command = "qu";
this.regex = /^(?:(\d+\s+))?(\w+)$/;
this.enter = function (me, count, arg) {
    if (!me.environment.allow_store) return me.notify("这里没有仓库。");

    if (!arg) return me.notify("你要取什么东西？");

    me.items = me.items || [];
    var obj = {};
    obj.remove_item_byid = me.remove_item_byid;
    obj.items = me.stores || [];
    var move_count = 1;
    if (count) move_count = parseInt(count);
    var moved_obj = obj.remove_item_byid(arg, move_count);
    if (!moved_obj) return me.notify("你的仓库里没有这样东西。");

    moved_obj = me.push_item(moved_obj);
    me.stores = obj.items;
    me.send_room("$N从仓库里取出" + UTIL.to_c(move_count) + moved_obj.unit + moved_obj.color_name + "。");

    me.notify('{type:"dialog",dialog:"list",id:"' + moved_obj.id + '",storeid:"' + arg + '",store:' + (-move_count) + '}');

}
}
