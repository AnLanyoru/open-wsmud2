import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '舍利塔';
    desc = '舍利塔下檀香浓郁，东西两侧护法阁各有两名高僧守关，正中的宝殿通往寺院深处。';
    exits = {
        southwest: 'fb/tianlong/wuwo',
        southeast: 'fb/tianlong/wule',
        north: 'fb/tianlong/talin',
        south: 'fb/tianlong/baodian',
    };

    on_leave(me: USER, dir: string) {
        if (dir !== 'southwest' && dir !== 'southeast') return;
        const route = dir === 'southwest' ? 'west' : 'east';
        const chosen = this.fb_query_temp('tianlong_route', me, '');
        if (chosen && chosen !== route) return me.notify_fail('另一侧护殿僧已经封闭阁门，只能沿原路线前进。');
        this.fb_set_temp('tianlong_route', route, me);
    }
}
