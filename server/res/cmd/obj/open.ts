import { COMMAND } from "../../../core/command.js";
import { CHARACTER } from "../../../core/char/character.js";
import { UTIL } from "../../../core/util/util.js";

export default class extends COMMAND {
    command = "open";

    /**
     * @param {CHARACTER} player - 执行命令的角色
     */
    enter(player, objid) {
    var obj = player.find_obj(objid);
    if (!obj) return player.notify("你要打开什么？");
    if (!obj.on_open) return player.notify("这个东西打不开。");
    var items = obj.on_open(player);
    if (items == false) return;
    if (!items || !items.length) {
        player.send_room("$N打开了" + obj.color_name + "，但是里面什么都没有。");
    } else {

       // if (player.is_full()) return player.notify("你身上东西太多了，放不下" + obj.color_name + "里的东西。");

        for (var i = 0; i < items.length; i++) {
            var item = player.add_obj(items[i]);
            if (item) {
                //if (item.is_equipment && item.grade > 5) {
                //    COMMAND.DO("rumor", "听说有人得到了一" + item.unit + item.name + "。");
                //}
                player.notify("你从" + obj.color_name + "里面拿出来" + UTIL.to_c(items[i].count) + item.unit + item.color_name + "。");
            }
        }
    }
    player.remove_obj(obj,1);
}
}

