import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '密室';
    desc = '密室墙上刻满移花宫心法图谱，角落摆着蒙尘木匣，花无缺已在灯下静候多时。';
    exits = {
        west: 'fb/yihua/xiaojing',
    };

    constructor() {
        super();
        this.set_npc('fb/yihua/huawuque');
    }
}
