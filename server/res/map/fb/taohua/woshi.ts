import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '卧室';
    desc = '卧房布置简朴，一名须发花白的老顽童抱着石匣躲在床后，见人便跃跃欲试。';
    exits = {
        south: 'fb/taohua/dating',
    };

    constructor() {
        super();
        this.set_npc('fb/taohua/zhoubotong');
    }

    on_enter(me: USER) {
        if (!me.is_player || this.fb_query_temp('diff', me, 0) !== 1 || this.query_temp('hard_initialized', false)) return;
        this.set_temp('hard_initialized', true);
        const npc = this.find_by_path('fb/taohua/zhoubotong');
        if (npc) npc.destroy();
    }
}
