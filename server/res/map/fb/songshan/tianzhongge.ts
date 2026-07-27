import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '天中阁';
    desc = '阁楼依山而建，石阶两侧古柏参天，一名嵩山太保按剑守住北面的道路。';
    exits = {
        south: 'fb/songshan/taishi',
        north: 'fb/songshan/dadian',
    };

    constructor() {
        super();
        this.set_npc('fb/songshan/taibao5');
    }
}
