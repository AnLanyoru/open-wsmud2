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
    is_multi = false;
    is_diffi = false;
    count_key = 'jd_longmai';
    map = [
        { n: '入口石室', id: 'longmai/shimen', p: [0, 0], exits: ['n'] },
        { n: '残碑厅', id: 'longmai/canbeit', p: [0, -1], exits: ['s', 'n'] },
        { n: '兵俑甬道', id: 'longmai/yongdao', p: [0, -2], exits: ['s', 'n'] },
        { n: '五行殿', id: 'longmai/wuxingdian', p: [0, -3], exits: ['s', 'n'] },
        { n: '回音廊', id: 'longmai/huiyinlang', p: [0, -4], exits: ['s', 'n'] },
        { n: '镇锁台', id: 'longmai/zhensuotai', p: [0, -5], exits: ['s', 'n'] },
        { n: '锁龙井', id: 'longmai/suolongjing', p: [0, -6] },
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

    on_login(me: USER) {
        const room = WORLD.getRoom(this.first);
        if (!room) return;
        const copyRoom = room.query_copy2(me) || room.create_copy2(me);
        if (!copyRoom || me.environment === copyRoom) return;
        me.moveto(copyRoom, undefined, '$N连线进入这个世界。');
    }

    on_leaved(me: USER) {
        this.clear_copy(me);
    }
}
