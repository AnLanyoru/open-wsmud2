import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '石洞';
    desc = '圆形石洞居于诸室中央，火把将四条甬道照得忽明忽暗。石破天每次提问后，诗句会指向其中一间石室。';
    exits = {
        east: 'fb/xiake/room_1',
        south: 'fb/xiake/room_2',
        north: 'fb/xiake/room_4',
        west: 'fb/xiake/room_3',
        northwest: 'fb/xiake/neiting',
    };

    on_before_enter(me: USER) {
        if (this.fb_query_temp('xiake_route', me, '') === 'reward' && !this.fb_query_temp('xiake_asked', me, 0)) {
            return me.notify_fail('石破天尚未提出诗句疑问，你现在无从判断对应石室。');
        }
    }
}
