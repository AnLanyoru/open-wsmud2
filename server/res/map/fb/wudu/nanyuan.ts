import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '南院';
    desc = '南院遍植奇花毒草，厢房、药室与练毒室分列三面，空气甜腻得令人头晕。';
    exits = {
        west: 'fb/wudu/xiangfang',
        east: 'fb/wudu/yaoshi',
        south: 'fb/wudu/liandu',
        north: 'fb/wudu/lianwu',
    };

    constructor() {
        super();
        this.set_npc('fb/wudu/jiaotu');
    }
}
