import { COMMAND } from "../../../os/command.js";

export default class extends COMMAND {
    command = "drop";
    regex = /^(?:(\d+\s))?(.+?)$/;

    enter(player, count, objid) {
    var obj = player.find_obj(objid);
    if (!obj) {
        return player.notify("你要丢掉什么东西？");
    }
    if (obj.is_locked) {
        return player.notify(obj.color_name + "处于锁定状态，无法丢弃，贩卖，分解。");
        // player.send_commands('lockobj ' + obj.id, '解除锁定');
    }
    if (obj.no_drop) return player.notify("这个东西丢不掉。");
    this.exec(player, obj, count);
}
    exec(player, obj, count) {
    if (!obj || !player.environment) return;
    var drop_count = 1;
    if (count) drop_count = parseInt(count);
    if (!(drop_count > 0)) return;
    if (obj.count > 0) {
        if (drop_count > obj.count) return player.notify("你身上没有那么多的" + obj.color_name + "。");
    } else {
        for (var i = 0; i < player.items.length; i++) {
            if (player.items[i] == obj) {
                player.items.splice(i, 1);
                player.send('{type:"dialog",dialog:"pack",id:"' + obj.id + '",remove:1}');
                return player.notify("你销毁了" + obj.color_name + "。");
            }
        }
        return player.notify("你什么都没丢掉。");
    }
    var drop_obj = player.remove_obj(obj, drop_count);
    if (drop_obj) {
        player.send_room("$N丢掉" + UTIL.to_c(drop_count) + obj.unit + obj.color_name + "。");
        WORLD.add_recover_obj(player, drop_obj, 0);
    } else {
        player.notify("你什么都没丢掉。");
    }
}
}

const WORLD = globalThis.WORLD;
const UTIL = globalThis.UTIL;
