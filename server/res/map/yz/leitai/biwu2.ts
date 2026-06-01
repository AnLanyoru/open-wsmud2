import { ROOM } from "../../../../core/room/room.js";
import { USER } from "../../../../core/char/user.js";
import type { CHARACTER } from "../../../../core/char/character.js";

export default class MapRoom extends ROOM {
    name = "擂台";
    desc = "你正站在一个白玉汉石砌成方圆数十丈的大擂台上面，擂台下面的观众声嘶力竭的呐喊助威，加油！加油！加油！加油！加油！加油！";
    exits = { "down": "yz/leitai/ltx" };
    max_item_count = 1;
    no_save = true;
    start_time = 0;

    constructor() {
        super();
        this.add_action("fight", "", function (this: MapRoom, me: CHARACTER) { return me.notify("你正在比试。") });
        this.add_action("kill", "", function (this: MapRoom, me: CHARACTER) { return me.notify("你正在比试。") });
        this.add_action("dazuo", "", function (this: MapRoom, me: CHARACTER) { return me.notify("你正在比试。") });
        this.add_action("liaoshang", "", function (this: MapRoom, me: CHARACTER) { return me.notify("你正在比试。") });
        this.add_action("relive", "", function (this: MapRoom, me: CHARACTER) { return me.notify("你正在比试。") });
    }

    on_enter(me: CHARACTER) {
        if (!me.is_player) return;
        const room = this;
        me.die = function (this: CHARACTER, killer?: CHARACTER) {
            if (this.environment && this.environment.items.length != 2) {
                return this.send("比武出现问题，请练习管理解决。");
            }
            if (!this.environment) return;
            var p1 = this.environment.items[0];
            var p2 = this.environment.items[1];
            if (!p1.is_player || !p2.is_player) {
                return this.send("比武出现问题，请练习管理解决。");
            }

            this.die = USER.prototype.die;
            if (killer) killer.die = USER.prototype.die;
            this.send_room("<hic>比武结束," + (killer ? killer.name : "") + "获得胜利，5秒钟后将离开擂台。</hic>");
            if (killer) killer.send("<hig>恭喜你获得胜利，积分+1，目前积分</hig>");

            this.call_out(move_out, 5000);
        };
        this.start_time = Date.now();
        me.call_interval(
            function (x: number) {
                me.send_message("\n<hic>挑战还有" + (10 - x) + "秒钟正式开始！</hic>", true);
            },
            1000,
            10,
            function () {
                var npc: CHARACTER | undefined;
                if (room.items.length > 0) {
                    const first = room.items[0];
                    if ('do_kill' in first && !first.is_player) {
                        npc = first;
                    }
                }
                if (npc) {
                    npc.do_kill(me);
                }
            }
        );
    }
    on_heart_beat(dt: number): void {
        if (this.start_time) {
            if (dt - this.start_time >= 300000) {

                this.start_time = 0;
                if (!this.items.length) {
                    return;
                }
                if (this.items.length == 1) {
                    var obj = this.items[0];
                    if ('do_kill' in obj && obj.is_player) {
                        obj.moveto(obj.query_temp("enter_room"), undefined, obj.name + "走了进来。", "endfight");
                        obj.notify("<yel>你挑战失败。</yel>");
                    } else {
                        this.items.length = 0;
                        obj.environment = null;
                    }
                    return;
                }
                var player: CHARACTER | null = null;
                for (var i = 0; i < this.items.length; i++) {
                    const item = this.items[i];
                    if ('do_kill' in item && item.is_player) {
                        player = item;
                    } else {
                        item.environment = null;
                    }
                }
                if (player) {
                    player.moveto(player.query_temp("enter_room"), undefined, player.name + "走了进来。", "endfight");
                    player.notify("<yel>你挑战超时，自动离开擂台。</yel>");
                }
                this.items.length = 0;
            }
        }
    };
    on_leave(me: CHARACTER, dir: string) {
        return me.notify_fail("你比试完才可以下擂台。");
    }
}

function move_out() {

}
