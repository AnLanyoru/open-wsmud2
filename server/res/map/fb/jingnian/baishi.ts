import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '白石广场';
    desc = '整座广场以洁白巨石铺成，三名护寺僧结成品字阵势，封住通往钟楼、铜殿与后山的道路。';
    exits = {
        northwest: 'fb/jingnian/zhonglou',
        east: 'fb/jingnian/houshan',
        northup: 'fb/jingnian/tongdian',
        southdown: 'fb/jingnian/daxiong',
    };

    constructor() {
        super();
        this.set_npc(['fb/jingnian/huseng', 3]);
    }

    on_leave(me: USER, dir: string) {
        if (dir !== 'southdown' && this.is_here('fb/jingnian/huseng')) return me.notify_fail('护寺僧结成伏魔阵，将前路尽数封住。');
        const route = this.fb_query_temp('jingnian_route', me, '');
        if (route === 'sengwang' && dir === 'northup' && !this.fb_query_temp('jingnian_bell', me, false)) return me.notify_fail('僧王线须先到钟楼等候黑影扑向铜殿。');
        if (route === 'shaoshuai' && dir === 'east' && !this.fb_query_temp('jingnian_bell', me, false)) return me.notify_fail('少帅线须先到钟楼等候黑影奔往后山。');
    }
}
