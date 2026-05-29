import { OBJ } from "../../../os/item/obj.js";
import { ROOM } from "../../../os/room/room.js";

export default class extends OBJ {
    name = "雄黄";
    desc = "一块雄黄，驱蛇效果俱佳";
    unit = "块";
    value = 10;
    grade = 1;
    combined = true;
    allow_fight = true;
    transable = true;
    otype = 3;

    on_use(me) {
    me.notify("<hic>你把雄黄捏碎，朝四周撒去。</hic>");
    var list = [];
    for (var i = 0; i < me.environment.items.length; i++) {
        if (me.environment.items[i].is('yz/lw/she')) {
            list.push(me.environment.items[i]);
        }
    }
    if (!list.length) return;
    var exits = [];
    for (var dir in me.environment.exits) {
        exits.push(me.environment.exits[dir]);
    }
    if (!exits.length) return;

    for (var i = 0; i < list.length; i++) {
        list[i].hp = list[i].max_hp;
        list[i].moveto(ROOM.Get(exits.random()).query_copy2(me), '毒蛇被熏的四散逃去。');
    }

}
}

