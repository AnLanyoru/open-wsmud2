import { ROOM } from "../../../../core/room/room.js";
import { WORLD } from "../../../../core/world.js";
import type { CHARACTER } from "../../../../core/char/character.js";

export default class MapRoom extends ROOM {
    name = "擂台";
    desc = "你正站在一个白玉汉石砌成方圆数十丈的大擂台上面，擂台下面的观众声嘶力竭的呐喊助威，加油！加油！加油！加油！加油！加油！";
    exits = {};
    max_item_count = 1;
    no_save = true;

    constructor() {
        super();
        var act: ReturnType<ROOM['add_action']>;
        act = this.add_action("fight", "", function (this: MapRoom, me: CHARACTER) {
            me.notify("你正在擂台比试。");
            return true;
        });
        if (act) act.allow_fight = true;
        act = this.add_action("kill", "", function (this: MapRoom, me: CHARACTER) {
            me.notify("你正在擂台比试。");
            return true;
        });
        if (act) act.allow_fight = true;
        act = this.add_action("dazuo", "", function (this: MapRoom, me: CHARACTER) {
            me.notify("你正在擂台比试。");
            return true;
        });
        if (act) act.allow_fight = true;
        act = this.add_action("liaoshang", "", function (this: MapRoom, me: CHARACTER) {
            me.notify("你正在擂台比试。");
            return true;
        });
        if (act) act.allow_fight = true;
        act = this.add_action("perform", "", function (this: MapRoom, me: CHARACTER) {
            me.notify("擂台上自动出招。");
            return true;
        });
        if (act) act.allow_fight = true;
        act = this.add_action("unequip", "", function (this: MapRoom, me: CHARACTER) {
            me.notify("擂台上自动出招，不允许卸下装备。");
            return true;
        });
        if (act) act.allow_fight = true;
        act = this.add_action("enable", "", function (this: MapRoom, me: CHARACTER) {
            me.notify("擂台上自动出招，不能更改武功。");
            return true;
        });
        if (act) act.allow_fight = true;
        act = this.add_action("surrender", '投降', function (this: MapRoom, me: CHARACTER) {
            if (WORLD.COMMANDS.biwu && typeof WORLD.COMMANDS.biwu === 'object' && 'surrender' in WORLD.COMMANDS.biwu) {
                (WORLD.COMMANDS.biwu as Record<string, any>).surrender(me);
            }
            return true;
        });
        if (act) act.allow_fight = true;
    }

    on_leave(me: CHARACTER, dir: string) {
        if (dir == "fightend") {
            return true;
        }
        return me.notify_fail("你比试完才可以下擂台。");
    }
}
