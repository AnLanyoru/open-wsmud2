import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '北峰';
    desc =
        "北峰寒气最盛，乱石间冰棱倒悬，一灯大师手拈佛珠静候来客，身后<cmd cmd='look cliff'>岩壁</cmd>似有人工攀凿痕迹。";
    exits = {
        south: 'fb/huashan_lunjian/tai',
    };

    constructor() {
        super();
        this.set_npc('fb/huashan_lunjian/yideng');
        this.set_item('cliff', '岩壁', '岩缝中留着可供借力的凹槽，顶端似乎另有天地。', [
            ['climb', '攀上绝顶', this.climb],
        ]);
    }

    climb(me: USER) {
        if (me.query_fbscore() < 100) return me.notify('五绝尚未尽数论过，峰顶罡风令你无从借力。');
        const room = this.query('fb/huashan_lunjian/huashanjueding');
        if (room) me.moveto(room, undefined, '$N踏着岩缝借力而上，翻身跃上华山绝顶。');
    }

    on_leave(me: USER) {
        if (this.find_by_path('fb/huashan_lunjian/yideng')) {
            return me.notify_fail('一灯大师指力封住山道，论剑结束前不可离开。');
        }
    }
}
