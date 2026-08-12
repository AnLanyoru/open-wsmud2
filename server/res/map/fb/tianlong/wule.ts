import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '无乐阁';
    desc = '钟磬之声在空阁中回荡，本尘和尚守着南门，神色肃穆不容闯入。';
    exits = {
        northwest: 'fb/tianlong/ta',
        south: 'fb/tianlong/wujing',
    };

    constructor() {
        super();
        this.set_npc('fb/tianlong/benchen');
    }

    on_enter(me: USER) {
        if (!me.is_player || this.fb_query_temp('diff', me, 0) !== 1 || this.query_temp('hard_initialized', false)) return;
        this.set_temp('hard_initialized', true);
        const monk = this.find_by_path('fb/tianlong/benchen');
        if (monk?.check_npc()) monk.score = 0;
    }

    on_leave(me: USER, dir: string) {
        if (dir !== 'south' || !this.find_by_path('fb/tianlong/benchen')) return;
        if (this.fb_query_temp('diff', me, 0) === 1) {
            if (hasDisguise(me)) return;
            return me.notify_fail('本尘和尚看破你的身份；困难模式必须戴上阿朱的易容面具混入寺内。');
        }
        return me.notify_fail('本尘和尚拦住去路，你必须击败他才能继续前行。');
    }
}

function hasDisguise(me: USER) {
    return me.equipment.some(item => item?.path === 'eq/lv4/azhudeyirongmianju');
}
