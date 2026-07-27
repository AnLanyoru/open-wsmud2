import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '庄门';
    desc = '庄门飞檐临水，朱漆门扇上悬着慕容氏匾额，包不同叉手挡在门前。';
    exits = {
        west: 'fb/yanzi/hc1',
        east: 'fb/yanzi/qianyuan',
    };

    constructor() {
        super();
        this.set_npc('fb/yanzi/baobutong');
    }
}
