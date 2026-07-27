import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '半山腰';
    desc = '山腰云气翻涌，崎岖小路分向两侧，张中早已在乱石间摆开架势。';
    exits = {
        north: 'fb/guangming/xiaolu1',
        south: 'fb/guangming/banshanting',
        east: 'fb/guangming/shanpo1',
    };

    constructor() {
        super();
        this.set_npc('fb/guangming/zhangzhong');
    }
}
