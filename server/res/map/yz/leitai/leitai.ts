import { ROOM } from "../../../../core/room/room.js";
import { WORLD } from "../../../../core/world.js";

export default class extends ROOM {
    name = "擂台";
    desc = "你正站在一个白玉汉石砌成方圆数十丈的大擂台上面，擂台下面的观众声嘶力竭的呐喊助威，加油！加油！加油！加油！加油！加油！";
    exits = {};
    max_item_count = 1;
    no_save = true;

    constructor() {
        super();
        this.add_action("fight", null, function (me) {
            me.notify("你正在擂台比试。");
            return true;
        }).allow_fight = true;
        this.add_action("kill", null, function (me) {
            me.notify("你正在擂台比试。");
            return true;
        }).allow_fight = true;
        this.add_action("dazuo", null, function (me) {
            me.notify("你正在擂台比试。");
            return true;
        }).allow_fight = true;
        this.add_action("liaoshang", null, function (me) {
            me.notify("你正在擂台比试。");
            return true;
        }).allow_fight = true;
        this.add_action("perform", null, function (me) {
            me.notify("擂台上自动出招。");
            return true;
        }).allow_fight = true;
        this.add_action("unequip", null, function (me) {
            me.notify("擂台上自动出招，不允许卸下装备。");
            return true;
        }).allow_fight = true;
        this.add_action("enable", null, function (me) {
            me.notify("擂台上自动出招，不能更改武功。");
            return true;
        }).allow_fight = true;
        this.add_action("surrender", '投降', function (me) {
            WORLD.COMMANDS.biwu.surrender(me);
            return true;
        }).allow_fight = true;
    }

    on_leave(me, dir) {

        if (dir == "fightend") {
            return true;
        }
        return me.notify_fail("你比试完才可以下擂台。");
    }
}
