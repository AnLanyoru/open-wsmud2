import { ROOM } from '../../../core/room/room.js';

export default class extends ROOM {
    name = '龙脉石室';
    desc = '石门之后是一座宽阔石室，四周散落着青黑色碎岩，北侧甬道深处传来锁链摩擦声。';
    exits = { north: 'longmai/yongdao', out: 'yz/guangchang' };

    constructor() {
        super();
        this.set_npc('bj/lm/xiezi');
    }
}
