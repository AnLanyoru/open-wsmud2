import { AREA } from '../../../core/room/area.js';

export default class extends AREA {
    id = 'longmai';
    name = '龙脉';
    desc = '深藏山腹的龙脉禁地，玄铁锁链与残破兵俑守着盘龙石柱。';
    first = 'longmai/shimen';
    room_path = 'longmai/';
    is_copy = true;
    is_show = true;
    is_multi = false;
    is_diffi = false;
    score = 100;
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
}
