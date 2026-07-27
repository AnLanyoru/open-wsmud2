import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '古龙桥';
    desc = '石桥横跨深涧，桥身盘曲如卧龙，湿冷山风卷着水汽从桥下呼啸而过。';
    exits = {
        south: 'fb/qingcheng/tianshidong',
        north: 'fb/qingcheng/sanwan',
    };

    constructor() {
        super();
        this.set_npc('fb/qingcheng/dizi');
    }
}
