import { CHARACTER } from "../../../core/char/character.js";
import {OBJ} from "../../../core/item/obj.js";
import {ROOM} from "../../../core/room/room.js";
import { WORLD } from "../../../core/world.js";

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

    on_use(me: CHARACTER) {
        if (!me.environment) return me.send("你现在不能使用雄黄。");
        me.notify("<hic>你把雄黄捏碎，朝四周撒去。</hic>");
        var list: CHARACTER[] = [];
        for (var i = 0; i < me.environment.items.length; i++) {
            if (me.environment.items[i].is('yz/lw/she')) {
                list.push(me.environment.items[i] as CHARACTER);
            }
        }
        if (!list.length) return;
        var exits: string[] = [];
        for (var dir in me.environment.exits) {
            exits.push(me.environment.exits[dir]);
        }
        if (!exits.length) return;

        for (var i = 0; i < list.length; i++) {
            list[i].hp = list[i].max_hp;
            list[i].moveto(WORLD.getRoom(exits.random())?.query_copy2(me), '毒蛇被熏的四散逃去。');
        }

    }
}

