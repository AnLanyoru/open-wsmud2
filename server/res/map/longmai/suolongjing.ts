import { ROOM } from '../../../core/room/room.js';

export default class extends ROOM {
    name = '锁龙井';
    desc = '盘龙石柱直抵穹顶，玄铁锁链没入幽深井壁，一条黑龙被牢牢锁在石柱之上。';
    exits = { south: 'longmai/zhensuotai' };

    constructor() {
        super();
        this.set_npc('bj/lm/heilong');
    }
}
