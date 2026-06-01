import { ROOM } from "../../../../core/room/room.js";
import { WORLD } from "../../../../core/world.js";

export default class extends ROOM {
    name = "客店后院";
    desc = "这里客店后院。一阵阵打斗之声从东面的厢房中传来，其中夹杂着一个女子的声音。房门的板壁不住的震动，似乎客房四周的板壁都要被刀风掌力震坍一般。西首也是厢房，不时有人探头出来观望。北面是客店大门。";
    exits = { "east": "bj/tdh/kedian3", "south": "bj/tdh/andao", "west": "bj/tdh/hutong"};

    constructor() {
        super();
        this.add_action('lkfb', null, this.lkfb);
    }

    lkfb(me, par) {
        if (par) {
            WORLD.COMMANDS['cr'].enter(me, 'over');
            me.moveto(ROOM.Get('bj/hg/xiaolu'));
            me.send('你从客栈后院出来，来到一个胡同里面。');
        } else {
            me.send('你即将离开这个副本进入公共区域，是否确认？');
            me.send_commands('lkfb ok', '确认进入');
        }
    }

    on_enter(me) {
    me.notify("你走出天地会暗道，发现来到一处客店的后院。");
}
    on_leave(me, dir) {
    if (dir === "east") {
        var lv = me.query_skill("dodge", 0);
        if (lv < 200) {
            return me.notify_fail("你一步踏进客房，突觉一股力道奇大的劲风激扑出来，将你一撞，你登时立足不稳，腾腾腾到退三步，一跤坐倒。");
        }
    }
    if (dir === 'west') {
        this.actions['lkfb'].action(me);
        return false;
    }
}
}

