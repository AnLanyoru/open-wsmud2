import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '般若台';
    desc = '白石高台沐在天光之下，东西两阁在此交汇，南侧牟尼堂禅意深沉。';
    exits = {
        west: 'fb/tianlong/wuchang',
        east: 'fb/tianlong/wujing',
        south: 'fb/tianlong/munitang',
    };

    on_leave(me: USER, dir: string) {
        if (dir === 'south' && this.fb_query_temp('diff', me, 0) === 1 && !hasDisguise(me))
            return me.notify_fail('牟尼堂戒备森严，必须继续戴着阿朱的易容面具才能接近段誉。');
        if (dir !== 'west' && dir !== 'east') return;
        const route = this.fb_query_temp('tianlong_route', me, '');
        if (route && route !== dir) return me.notify_fail('另一侧护殿僧已经封闭阁门，只能沿原路线返回。');
    }
}

function hasDisguise(me: USER) {
    return me.equipment.some(item => item?.path === 'eq/lv4/azhudeyirongmianju');
}
