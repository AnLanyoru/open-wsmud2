import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '云梦沼泽';
    desc = '沼泽在此分出数条水道，淤泥深不见底，两条巨鳄在水面缓缓游弋。';
    exits = {
        south: 'fb/yunmeng/zhaoze1',
        east: 'fb/yunmeng/zhaoze3',
        north: 'fb/yunmeng/zhaoze4',
    };

    constructor() {
        super();
        this.set_npc(['fb/yunmeng/eyu', 2]);
    }
}
