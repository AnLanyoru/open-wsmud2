import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '密林';
    desc = '密林遮天蔽日，三条岔路分别通向风雷堂、天香堂和总坛悬崖，戒备森严。';
    exits = {
        north: 'fb/heimu/fl_tang',
        south: 'fb/heimu/tx_tang',
        west: 'fb/heimu/shangu',
        east: 'fb/heimu/up1',
    };
    on_leave(me: USER, dir: string) {
        if (this.fb_query_temp('diff', me, 0) === 1 && dir === 'north') return me.notify_fail('困难模式的风雷堂主已撤往崖顶，须从东面悬崖追上去。');
    }
}
