import { ROOM } from '../../../../core/room/room.js';
import { NPC } from '../../../../core/char/npc.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '前院';
    desc = '院中种满奇花异草，清泉绕石而流，一名俏丽少女立在花间，正含笑打量来客。';
    exits = {
        west: 'fb/taohua/damen',
        east: 'fb/taohua/dating',
    };

    constructor() {
        super();
        this.set_npc('fb/taohua/huangrong');
    }

    on_enter(me: USER) {
        if (!me.is_player || this.fb_query_temp('diff', me, 0) !== 1 || this.query_temp('hard_initialized', false)) return;
        this.set_temp('hard_initialized', true);
        const npc = this.find_by_path('fb/taohua/huangrong');
        if (npc) npc.destroy();
        NPC.CREATE('fb/taohua/huangyaoshi', this);
    }
}
