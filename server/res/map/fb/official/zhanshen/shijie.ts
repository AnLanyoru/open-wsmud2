import { ROOM } from '../../../../../core/room/room.js';
import type { USER } from '../../../../../core/char/user.js';

export default class extends ROOM {
    name = '天外石阶';
    desc = '石阶悬浮在无底虚空之上，每一级都刻着失传武学的残招，尽头神石被血色雷光与混沌气息笼罩。';
    exits = {
        south: 'fb/official/zhanshen/dadian',
        north: 'fb/official/zhanshen/xuankong',
    };

    on_leave(me: USER, dir: string) {
        if (dir === 'north' && !this.fb_query_temp('zhanshen_daohuang', me, false)) {
            return me.notify_fail('刀皇的无形刀意横断虚空，先击败他才能踏上悬空神石。');
        }
    }
}
