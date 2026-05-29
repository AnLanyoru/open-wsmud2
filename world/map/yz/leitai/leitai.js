import { ROOM } from "../../../../os/room/room.js";

export default function() {
    const WORLD = globalThis.WORLD;
this.inherits(ROOM);
this.name = "擂台"
this.desc = "你正站在一个白玉汉石砌成方圆数十丈的大擂台上面，擂台下面的观众声嘶力竭的呐喊助威，加油！加油！加油！加油！加油！加油！";
this.exits = {};
this.max_item_count = 1;
this.no_save = true;


this.add_action("fight", null, function (me) {
    me.notify("你正在擂台比试。");
    return true;
}).allow_fight = true;;
this.add_action("kill", null, function (me) {
    me.notify("你正在擂台比试。");
    return true;
}).allow_fight = true;;
this.add_action("dazuo", null, function (me) {
    me.notify("你正在擂台比试。");
    return true;
}).allow_fight = true;;
this.add_action("liaoshang", null, function (me) {
    me.notify("你正在擂台比试。");
    return true;
}).allow_fight = true;;
this.add_action("perform", null, function (me) {
    me.notify("擂台上自动出招。");
    return true;
}).allow_fight = true;;
this.add_action("unequip", null, function (me) {
    me.notify("擂台上自动出招，不允许卸下装备。");
    return true;
}).allow_fight = true;;
// this.add_action("equip", null, function (me) {
//     me.notify("擂台上自动出招。");
//     return true;
// });
this.add_action("enable", null, function (me) {
    me.notify("擂台上自动出招，不能更改武功。");
    return true;
}).allow_fight = true;
// this.add_action("use", null, function (me) {

//     me.notify("擂台上自动出招，不允许使用道具。");
//     return true;
// }).allow_fight = true;;
this.add_action("surrender", '投降', function (me) {
    WORLD.COMMANDS.biwu.surrender(me);
    return true;
}).allow_fight = true;
// this.start_time = 0;
// this.on_enter = function (me) {
//     if (!me.is_player) return;


// }
// this.start_challenge = function (me, index) {
//     if (me.environment !== this) return;

// }

this.on_leave = function (me, dir) {

    if (dir == "fightend") {
        return true;
    }
    // if (dir == "down") {
    //     return me.notify_fail("你比试完才可以下擂台。");
    // }
    return me.notify_fail("你比试完才可以下擂台。");
}
}
