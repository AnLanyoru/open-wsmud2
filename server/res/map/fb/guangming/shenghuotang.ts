import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '圣火堂';
    desc = '圣火熊熊照亮穹顶，左右光明使分立两侧，张无忌静立于圣火之前。';
    exits = {
        south: 'fb/guangming/juyiting',
        west: 'fb/guangming/xiaoting',
    };

    constructor() {
        super();
        this.set_npc('fb/guangming/yangxiao');
        this.set_npc('fb/guangming/fanyao');
        this.set_npc('fb/guangming/zhangwuji');
    }
}
