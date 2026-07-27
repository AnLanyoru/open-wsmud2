import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '论剑台';
    desc = '峰顶石台被风雪磨得平整，四方绝顶遥遥相望，五位宗师的气机令山间云海翻涌不休。';
    exits = {
        north: 'fb/huashan_lunjian/beifeng',
        west: 'fb/huashan_lunjian/xifeng',
        east: 'fb/huashan_lunjian/dongfeng',
        south: 'fb/huashan_lunjian/nanfeng',
    };

    constructor() {
        super();
        this.set_npc('fb/huashan_lunjian/wangchongyang');
    }

    on_leave(me: USER) {
        if (this.find_by_path('fb/huashan_lunjian/wangchongyang')) {
            return me.notify_fail('王重阳剑意笼罩论剑台，战胜他之前不可离开。');
        }
    }
}
