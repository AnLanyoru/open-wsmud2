import { ROOM } from "../../../../core/room/room.js";
import { WORLD } from "../../../../core/world.js";

export default class extends ROOM {
    name = "暗道";
    desc = "这里是鳌拜卧室的一个暗道，整个通道黑呼呼的，不知道通往哪里。";
    exits = { "south": "bj/ao/woshi" };

    constructor() {
        super();
        this.add_action('lkfb', null, this.lkfb);
    }

    lkfb(me, par) {
        if (par) {
            WORLD.COMMANDS['cr'].enter(me, 'over');
            me.moveto(ROOM.Get('bj/hg/jiashan'));
            me.send('你从暗道出来，来到一个假山外面。');
            me.enable_area();
        } else {
            me.send('你即将离开这个副本进入公共区域，是否确认？');
            me.send_commands('lkfb ok', '确认进入');
        }
    }

    on_enter(me) {

    me.notify('你踏入暗道，放眼望去看不到出口，不知通往何处。');
    me.send_commands('lkfb', '一直走下去');
}
}

