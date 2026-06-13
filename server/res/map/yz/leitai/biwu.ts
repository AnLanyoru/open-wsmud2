import {ROOM} from "../../../../core/room/room.js";
import {USER} from "../../../../core/char/user.js";
import {TASK} from "../../../../core/task/task.js";
import {COMMAND} from "../../../../core/command.js";
import type {CHARACTER} from "../../../../core/char/character.js";

export default class MapRoom extends ROOM {
    name = "擂台";
    desc = "你正站在一个白玉汉石砌成方圆数十丈的大擂台上面，擂台下面的观众声嘶力竭的呐喊助威，加油！加油！加油！加油！加油！加油！";
    exits = {"down": "yz/leitai/ltx"};
    max_item_count = 2;
    no_save = true;

    constructor() {
        super();
        this.add_action("fight", "", function (this: MapRoom, me: CHARACTER) {
            return me.notify("你正在比试。")
        });
        this.add_action("kill", "", function (this: MapRoom, me: CHARACTER) {
            return me.notify("你正在比试。")
        });
        this.add_action("dazuo", "", function (this: MapRoom, me: CHARACTER) {
            return me.notify("你正在比试。")
        });
        this.add_action("liaoshang", "", function (this: MapRoom, me: CHARACTER) {
            return me.notify("你正在比试。")
        });
    }

    on_enter(me: CHARACTER) {
        me.full();
        if (this.items.length != 2) return;
        const p1 = this.items[0] as CHARACTER;
        const p2 = this.items[1] as CHARACTER;
        p1.die = arenaDieHandle;
        p2.die = arenaDieHandle;
        const room = this;
        this.call_interval((x: number) => {
                if (p1.environment != p2.environment) return false;
                if (p1.environment != room) return false;
                p2.send_message("\n<hic>比赛还有" + (5 - x) + "秒钟正式开始！</hic>", true);
            },
            1000,
            5,
            function () {
                p1.do_kill(p2);
            }
        );

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

/**
 * 擂台战败死亡处理函数
 * @param killer 击杀方角色
 */
function arenaDieHandle(this: CHARACTER, killer?: CHARACTER) {
    if (!killer) return;
    const loser = this;
    const winner = killer;

    // 广播武林大会战报
    COMMAND.DO("sys", "武林大会：" + winner.name + "战胜了" + loser.name + "。");

    // 败者回满血
    loser.hp = 100;
    // 胜者加比武积分
    winner.add_temp("fight_sc", 1) as number;

    // 双方弹窗提示
    winner.notify("\n<hig>你战胜了对手，获得比武积分1，5秒钟后将离开擂台。</hig>\n");
    loser.notify("\n<hig>你的比赛失败了，本轮积分不变，5秒钟后将离开擂台。</hig>\n");

    // 5秒后双双返回入场房间
    this.call_out(function () {
        loser.moveto(loser.query_temp("enter_room"), undefined, loser.name + "走了进来。", "out");
        winner.moveto(winner.query_temp("enter_room"), undefined, winner.name + "走了进来。", "out");
    }, 5000);

    // 触发战斗结束任务回调
    const task = TASK.GET('fight');
    task.battle_over!(loser, winner);
}
