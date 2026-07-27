import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '丛林';
    desc = '针叶林覆盖着厚厚积雪，树干留有巨大爪痕，一头大白熊循着生人气味冲来。';
    exits = {
        south: 'fb/binghuo/haibian',
        north: 'fb/binghuo/conglin2',
    };

    constructor() {
        super();
        this.set_npc('fb/binghuo/baixiong');
    }
}
