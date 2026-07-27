import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '西峰';
    desc = '西峰峭壁如刀削斧劈，积雪间立着一根蛇杖，欧阳锋盘膝运功，周遭寒风竟被内力逼开。';
    exits = {
        east: 'fb/huashan_lunjian/tai',
    };

    constructor() {
        super();
        this.set_npc('fb/huashan_lunjian/ouyangfeng');
    }

    on_leave(me: USER) {
        if (this.find_by_path('fb/huashan_lunjian/ouyangfeng')) {
            return me.notify_fail('欧阳锋蛇杖横拦，论剑结束前不可离开。');
        }
    }
}
