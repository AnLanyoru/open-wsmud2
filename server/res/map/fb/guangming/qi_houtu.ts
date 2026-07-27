import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '厚土旗';
    desc = '黄褐大旗插在石垒中央，沟壑纵横如阵，掌旗使颜垣扛铲守候。';
    exits = {
        south: 'fb/guangming/guangmingding',
        east: 'fb/guangming/qi_hongshui',
        west: 'fb/guangming/qi_jumu',
        north: 'fb/guangming/lianwu',
    };

    constructor() {
        super();
        this.set_npc('fb/guangming/yanyuan');
    }
}
