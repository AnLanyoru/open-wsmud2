import { ROOM } from "../../../../core/room/room.js";
import { USER } from "../../../../core/char/user.js";
import { TASK } from "../../../../core/task/task.js";
import { COMMAND } from "../../../../core/command.js";
import type { CHARACTER } from "../../../../core/char/character.js";

export default class MapRoom extends ROOM {
    name = "擂台";
    desc = "你正站在一个白玉汉石砌成方圆数十丈的大擂台上面，擂台下面的观众声嘶力竭的呐喊助威，加油！加油！加油！加油！加油！加油！";
    exits = { "down": "yz/leitai/ltx" };
    max_item_count = 2;
    no_save = true;

    constructor() {
        super();
        this.add_action("fight", "", function (this: MapRoom, me: CHARACTER) { return me.notify("你正在比试。") });
        this.add_action("kill", "", function (this: MapRoom, me: CHARACTER) { return me.notify("你正在比试。") });
        this.add_action("dazuo", "", function (this: MapRoom, me: CHARACTER) { return me.notify("你正在比试。") });
        this.add_action("liaoshang", "", function (this: MapRoom, me: CHARACTER) { return me.notify("你正在比试。") });
    }

    on_enter(me: CHARACTER) {
        me.full();
        if (this.items.length != 2) return;
        var p1 = this.items[0];
        var p2 = this.items[1];
        if ('do_kill' in p1 && 'do_kill' in p2) {
            p1.die = function (this: CHARACTER, killer?: CHARACTER) {
                if (!killer) return;
                var p1c = this;
                var p2c = killer;
                COMMAND.DO("sys", "武林大会：" + p2c.name + "战胜了" + p1c.name + "。");
                p1c.hp = 100;
                p2c.add_temp("fight_sc", 1) as number;
                p2c.notify("\n<hig>你战胜了对手，获得比武积分1，5秒钟后将离开擂台。</hig>\n");
                p1c.notify("\n<hig>你的比赛失败了，本轮积分不变，5秒钟后将离开擂台。</hig>\n");
                this.call_out(function () {
                    p1c.moveto(p1c.query_temp("enter_room"), undefined, p1c.name + "走了进来。", "out");
                    p2c.moveto(p2c.query_temp("enter_room"), undefined, p2c.name + "走了进来。", "out");
                }, 5000);
                var task = TASK.GET('fight');
                if (task && task.battle_over) {
                    task.battle_over(p1c, p2c);
                }
            };
            p2.die = p1.die;
            const room = this;
            this.call_interval((x: number) => {
                if (p1.environment != p2.environment) return false;
                if (p1.environment != room) return false;
                if ('send_message' in p2) {
                    p2.send_message("\n<hic>比赛还有" + (5 - x) + "秒钟正式开始！</hic>", true);
                }
            },
                1000,
                5,
                function () {
                    if ('do_kill' in p1 && 'do_kill' in p2) {
                        p1.do_kill(p2);
                    }
                }
            );
        }
    }
    on_leave(me: CHARACTER, dir: string) {
        if (dir == "out") {
            me.die = USER.prototype.die;
            return true;
        }
        me.notify("你正在比武，打完才能下擂台。");
        return false;
    }
}
