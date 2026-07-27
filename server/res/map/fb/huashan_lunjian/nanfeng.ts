import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '南峰';
    desc = '南峰古松盘根，石隙中积雪稍融，洪七公倚着碧竹杖大笑，豪迈声震得崖边碎雪簌簌而落。';
    exits = {
        north: 'fb/huashan_lunjian/tai',
    };

    constructor() {
        super();
        this.set_npc('fb/huashan_lunjian/hongqigong');
    }

    on_leave(me: USER) {
        if (this.find_by_path('fb/huashan_lunjian/hongqigong')) {
            return me.notify_fail('洪七公竹杖一横，论剑结束前不可离开。');
        }
    }
}
