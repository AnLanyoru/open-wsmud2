import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '锐金旗';
    desc = '白金旗帜映着满地寒光，兵刃排列如林，庄铮提刀封住出口。';
    exits = {
        south: 'fb/guangming/qi_jumu',
        east: 'fb/guangming/lianwu',
    };

    constructor() {
        super();
        this.set_npc('fb/guangming/zhuangzheng');
    }
}
