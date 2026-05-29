import { ROOM } from "../../../../os/room/room.js";
import { USER } from "../../../../os/char/user.js";

export default class extends ROOM {
    name = "擂台";
    desc = "你正站在一个白玉汉石砌成方圆数十丈的大擂台上面，擂台下面的观众声嘶力竭的呐喊助威，加油！加油！加油！加油！加油！加油！";
    exits = { "down": "yz/leitai/ltx" };
    max_item_count = 1;
    no_save = true;
    start_time = 0;

    constructor() {
        super();
        this.add_action("fight", null, function (me) { return me.notify("你正在比试。") });
        this.add_action("kill", null, function (me) { return me.notify("你正在比试。") });
        this.add_action("dazuo", null, function (me) { return me.notify("你正在比试。") });
        this.add_action("liaoshang", null, function (me) { return me.notify("你正在比试。") });
        this.add_action("relive", null, function (me) { return me.notify("你正在比试。") });
    }

    on_enter(me) {
    if (!me.is_player) return;
    me.die = challenge_over;
    this.start_time = Date.now();
    me.call_interval(x => {
        me.send_message("\n<hic>挑战还有" + (10 - x) + "秒钟正式开始！</hic>", true);
    },
        1000,
        10,
        function () {
            npc.do_kill(me);
        }
    );
}
    on_heart_beat(dt) {
    if (this.start_time) {
        if (dt - this.start_time >= 300000) {

            this.start_time = 0;
            if (!this.items.length) {
                return;
            }
            if (this.items.length == 1) {
                var obj = this.items[0];
                if (obj.is_player) {
                    obj.moveto(obj.query_temp("enter_room"), null, obj.name + "走了进来。", "endfight");
                    obj.notify("<yel>你挑战失败。</yel>");
                } else {
                    this.items.length = 0;
                    obj.environment = null;
                }
                return;
            }
            var player = null;
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].is_player) {
                    player = this.items[i];
                } else {
                    this.items[i].environment = null;
                }
            }
            if (player) {
                player.moveto(player.query_temp("enter_room"), null, player.name + "走了进来。", "endfight");
                player.notify("<yel>你挑战超时，自动离开擂台。</yel>");
            }
            this.items.length = 0;
        }
    }
}
    on_leave(me, dir) {
    return me.notify_fail("你比试完才可以下擂台。");
}
}

function challenge_over(killer) {
    if (this.environment.items.length != 2) {
        return this.send("比武出现问题，请练习管理解决。");;
    }
    var p1 = this.environment.items[0];
    var p2 = this.environment.items[1];
    if (!p1.is_player||!p2.is_player) {
        return this.send("比武出现问题，请练习管理解决。");;
    }
    

    this.die = USER.prototype.die;
    killer.die = USER.prototype.die;
    this.send_room("<hic>比武结束," + killer.name + "获得胜利，5秒钟后将离开擂台。</hic>");
    killer.send("<hig>恭喜你获得胜利，积分+1，目前积分</hig>");

    this.call_out(move_out, 5000);
}
function move_out() {
    
}
