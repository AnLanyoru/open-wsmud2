import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';
import { WORLD } from '../../../../core/world.js';

export default class extends ROOM {
    name = '小路';
    desc = '你走在一条小路上。前面道路崎岖，行人很少。往南有条小路通往城内。';
    exits = { north: 'bj/zhuang/xiaolu2' };

    constructor() {
        super();
        this.add_action('lkfb', null, this.lkfb);
    }

    lkfb(me: USER, par?: string) {
        if (par) {
            WORLD.COMMANDS.get('cr')!.enter(me, 'over');
            let hg_namen = WORLD.getRoom('bj/hg/nanmen');
            if (!hg_namen) return me.notify_fail('<hir>资源加载错误：皇宫-南门 不存在</hir>');
            me.moveto(hg_namen);
            me.send('你顺着小路进入京城，来到奉天城门。');
        } else {
            me.send('你即将离开并结算这个副本进入公共区域，是否确认？');
            me.send_commands('lkfb ok', '确认进入');
        }
    }

    on_before_enter(me: USER) {
        if (me.query_temp('fb', 0) > 10) {
            this.add_exit('south', 'bj/zhuang/dalu');
        }
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'south') {
            this.lkfb(me);
            return false;
        }
    }
}
