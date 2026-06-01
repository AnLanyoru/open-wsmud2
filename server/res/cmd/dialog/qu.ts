import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { UTIL } from "../../../core/util/util.js";
import { ITEM } from "../../../core/item.js";

export default class extends COMMAND {
    command = "qu";
    regex = /^(?:(\d+\s+))?(\w+)$/;

    /**
     * @param {CHARACTER} me - 执行命令的角色
     */
    enter(me, count, arg) {
    if (!me.environment.allow_store) return me.notify("这里没有仓库。");

    if (!arg) return me.notify("你要取什么东西？");

    me.items = me.items || [];
    var obj: { remove_item_byid: (id: string, count?: number) => ITEM | null | undefined; items: ITEM[] } = {
        remove_item_byid: me.remove_item_byid.bind(me),
        items: me.stores || [],
    };
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

