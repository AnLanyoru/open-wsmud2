import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '洪荒古泽';
    desc = '前方古泽泛着暗红微光，硫磺气味刺鼻，一头火龙卧在焦黑石滩上。';
    exits = {
        south: 'fb/yunmeng/zhaoze4',
        north: 'fb/yunmeng/huozhao2',
    };

    constructor() {
        super();
        this.set_npc('fb/yunmeng/huolong');
    }
}
