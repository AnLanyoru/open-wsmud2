import { ROOM } from "../../../../core/room/room.js";
import { WORLD } from "../../../../core/world.js";
import { NPC } from "../../../../core/char/npc.js";

export default class extends ROOM {
    name = "海滩";
    desc = "这里就是神龙岛了。南边是一望无际的大海；往北则是一片灌木林。岛上的空气似乎又热又闷, 咸湿的海风中带着一股腥臭, 又夹杂了一缕奇特的花香, 闻起来十分怪异，海边泊着一艘大船。";
    exits = { "north": "bj/shenlong/lin1" };

    constructor() {
        super();
        this.add_action('lkfb', null, this.lkfb);
    }

    lkfb(me, par) {
        let npc = this.items[0];
        if (npc && npc.is('penglai/wulang/jiangjiu')) {
            if (par) {
                WORLD.COMMANDS['cr'].enter(me, 'over');
                me.moveto('penglai/matou');
                me.send('你和' + npc.name + '乘坐大船，来到一个偏远神秘的小岛。');
                me.enable_area();
            } else {
                me.send('你即将离开这个副本进入公共区域，是否确认？');
                me.send_commands('lkfb ok', '确认进入');
            }
        }
    }

    on_before_enter(me) {
    if (!me.query_bool('fb2', 3) && me.query_temp('pl_yu')) {
        if (!this.items[0])
            NPC.CREATE('penglai/wulang/jiangjiu', this);
    }
}
    on_enter(me) {
    if (!me.query_bool('fb2', 3) && me.query_temp('pl_yu')) {
        let npc = this.items[0];
        if (npc && npc.is('penglai/wulang/jiangjiu')) {
            me.send(npc.name + "招了招手：" + me.call() + "，这里，这里。");
            this.call_out(this.to_next, 3000, me, npc);
        }
    }
}
    to_next(me, npc) {
    if (me.environment !== this || npc.environment !== this)
        return;
    if (me.fight_type || npc.fight_type) return;
    me.send(npc.name + "正色道：在下正准备去往近年江湖中传闻仙山出世的蓬莱岛，" + me.call() + "可愿一同前往？");

    me.send_commands('lkfb', '同去');

}
}

