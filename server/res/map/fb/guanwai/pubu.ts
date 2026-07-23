import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '瀑布';
    desc = '天池水从断崖倾泻而下，轰鸣声震耳欲聋。断崖下水雾弥漫，隐约可以看见瀑布下方的深潭。';
    exits = {
        west: 'fb/guanwai/xiaotianchi',
    };

    constructor() {
        super();
        this.add_action('jumpdown', '跳下去', this.jumpdown);
    }

    jumpdown(me: USER) {
        const owner = this.owner;
        if (!owner) return;
        const room = this.parent?.rooms
            ?.find(item => item.path == 'fb/guanwai/pubuxia')
            ?.query_copy(owner);
        if (!room) return;
        me.notify('你纵身跃出断崖，穿过飞溅的水雾向瀑布下方落去。');
        me.moveto(room, '$N纵身跳下了瀑布。', '$N从瀑布上方落了下来。');
        if (me.query_skill('dodge', 0) >= 200) {
            me.notify('你施展轻功卸去下坠之势，稳稳落在深潭边。');
        } else {
            me.notify('你轻功不济，重重摔在潭边的乱石上。');
            me.add_hp(-me.max_hp);
            me.die();
        }
    }
}
