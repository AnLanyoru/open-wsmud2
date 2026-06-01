import { ROOM } from "../../../core/room/room.js";
import { WORLD } from "../../../core/world.js";

export default class extends ROOM {
    name = "药铺";
    desc = "这是一家药铺，一股浓浓的药味让你几欲窒息，那是从药柜上的几百个小抽屉里散发出来的。神医平一指坐在茶几旁，独自喝着茶，看也不看你一眼。一名小伙计站在柜台后招呼着顾客。柜台上贴着一张发黄的<cmd cmd='look guanggao'>广告(guanggao)</cmd>。";
    exits = { "south": "yz/dongdajie2", "north": "yz/neishi" };
    no_fight = true;

    constructor() {
        super();
        this.set_item("guanggao", "告示", "本店招收学徒", [[
            "work", "开始工作", start_work
        ]]);
        this.set_npc("yz/ping");
        this.add_action("work", "开始工作", start_work);
    }
}

function start_work(me) {
    if (me.level > 1) return me.notify("平一指：小店本小利薄，哪里敢劳烦大侠！");
    me.send_room("$N开始在在药店当学徒......", me);
    me.set_state({
        id: "work",
        type: "work",
        title: "工作中",
        player: me,
        rate: 2,
        on_enter: do_work,
        no_move: "你还在打工，乱走就没工钱拿了！",
        desc: '["只见你随手一扔，药居然刚好扔进药箱，好运气呀。","你看着手上的药材，想了半天终于还是没有找到该放的地方。","你分的好仔细呀，还要检查一次！"]',
    });
    return true;
}
function do_work(me) {

    var exp = WORLD.DATA.get_exp(me);
    me.add_exp(exp, exp, 100 + me.random(20));
}
