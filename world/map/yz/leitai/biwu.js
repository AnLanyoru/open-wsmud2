import { ROOM } from "../../../../os/room/room.js";

export default function() {
    const USER = globalThis.USER; const TASK = globalThis.TASK; const COMMAND = globalThis.COMMAND;
this.inherits(ROOM);
this.name = "擂台"
this.desc = "你正站在一个白玉汉石砌成方圆数十丈的大擂台上面，擂台下面的观众声嘶力竭的呐喊助威，加油！加油！加油！加油！加油！加油！";
this.exits = { "down": "yz/leitai/ltx" };
this.max_item_count = 2;
this.no_save=true;
this.add_action("fight", null, function (me) { return me.notify("你正在比试。") });
this.add_action("kill", null, function (me) { return me.notify("你正在比试。") });
this.add_action("dazuo", null, function (me) { return me.notify("你正在比试。") });
this.add_action("liaoshang", null, function (me) { return me.notify("你正在比试。") });
this.on_enter = function (me) {
    me.full();
    if (this.items.length != 2) return;
    var p1 = this.items[0];
    var p2 = this.items[1];
    p1.die = this.on_die;
    p2.die = this.on_die;
    this.call_interval(x => {
        if (p1.environment != p2.environment) return false;
        if (p1.environment != this) return;
        p2.send_message("\n<hic>比赛还有" + (5 - x) + "秒钟正式开始！</hic>", true);
    },
        1000,
        5, x => {
            p1.do_kill(p2);
        }
    );
}
this.on_die = function (killer) {
    if (!killer) return;
    var p1 = this;
    var p2 = killer;
    COMMAND.DO("sys", "武林大会：" + p2.name + "战胜了" + p1.name + "。");
    p1.hp = 100;
    p2.add_temp("fight_sc", 1);
    p2.notify("\n<hig>你战胜了对手，获得比武积分1，5秒钟后将离开擂台。</hig>\n");
    p1.notify("\n<hig>你的比赛失败了，本轮积分不变，5秒钟后将离开擂台。</hig>\n");
    this.call_out(function (me) {
        p1.moveto(p1.query_temp("enter_room"), null, p1.name + "走了进来。", "out");
        p2.moveto(p2.query_temp("enter_room"), null, p2.name + "走了进来。", "out");
    },5000);
    var task = TASK.GET('fight');
    if (task) {
        task.battle_over(p1, p2);
    }
}
this.on_leave = function (me, dir) {
    if (dir == "out") {
        me.die = USER.prototype.die;
        return true;
    }
    me.notify("你正在比武，打完才能下擂台。");
    return false;
}
}
