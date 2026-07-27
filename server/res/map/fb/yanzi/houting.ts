import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '后厅';
    desc = "后厅香烟袅袅，正中供着慕容氏历代<cmd cmd='look memorial'>灵位</cmd>，牌前蒲团已有些磨损。";
    exits = {
        south: 'fb/yanzi/dating',
        east: 'fb/yanzi/neitang',
    };

    constructor() {
        super();
        this.set_item('memorial', '灵位', '慕容氏历代先祖灵位整齐排列，可以上前拜祭。', [
            ['worship', '拜祭', this.worship],
        ]);
    }

    worship(me: USER) {
        if (this.fb_query_temp('yanzi_opened', me, false)) return me.notify('灵位后的机关已经开启。');
        const count = this.fb_add_temp('yanzi_worship', 1, me) || 0;
        if (count < 3) return me.notify(`你恭敬拜祭灵位，暗处传来轻响，还需拜祭${3 - count}次。`);
        this.fb_set_temp('yanzi_opened', true, me);
        this.add_exit('north', 'fb/yanzi/hssg');
        me.send_room('$N第三次拜下，灵位后的墙壁缓缓移开，露出还施水阁。');
    }
}
