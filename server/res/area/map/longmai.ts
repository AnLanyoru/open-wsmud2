import type { USER } from '../../../core/char/user.js';
import { AREA } from '../../../core/room/area.js';
import { WORLD } from '../../../core/world.js';

export default class extends AREA {
    id = 'longmai';
    name = '龙脉';
    desc = '深藏山腹的龙脉禁地，玄铁锁链与残破兵俑守着盘龙石柱。';
    first = 'longmai/shimen';
    room_path = 'longmai/';
    is_copy = true;
    not_fb = true;
    is_show = true;
    is_multi = true;
    is_diffi = false;
    expend = 10;
    exp = 1900;
    pot = 1900;
    score = 100;
    count_key = 'jd_longmai';
    map = [
        { n: '龙脉石室', id: 'longmai/shimen', p: [0, 0] },
        { n: '幽暗甬道', id: 'longmai/yongdao', p: [0, -1] },
        { n: '锁龙井', id: 'longmai/suolongjing', p: [0, -2] },
    ];

    query_owner(me: USER) {
        return me.id;
    }

    on_enter(me: USER) {
        const room = WORLD.getRoom(this.first);
        if (!room) return false;
        const copyRoom = room.query_copy2(me) || room.create_copy2(me);
        if (!copyRoom) return false;
        me.moveto(copyRoom, '$N走了。', '$N来了。');
        return false;
    }

    on_leaved(me: USER) {
        this.clear_copy(me);
    }
}
