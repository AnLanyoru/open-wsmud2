import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '烈火旗';
    desc = '赤色战旗在火盆上方翻卷，热浪灼人，掌旗使辛然横刀以待。';
    exits = {
        south: 'fb/guangming/qi_hongshui',
        west: 'fb/guangming/lianwu',
        east: 'fb/guangming/duanya',
    };

    constructor() {
        super();
        this.set_npc('fb/guangming/xinran');
    }
}
