import { ROOM } from '../../../../core/room/room.js';
import { NPC } from '../../../../core/char/npc.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '熊洞';
    desc = '洞内铺着干草和熊皮，深处却有人类生活留下的石灶，一位金发盲眼汉子盘坐其旁。';
    exits = { out: 'fb/binghuo/shishan' };

    constructor() {
        super();
        this.set_npc('fb/binghuo/xiexun');
    }

    on_enter(me: USER) {
        if (!me.is_player || this.fb_query_temp('diff', me, 0) !== 1 || this.query_temp('hard_initialized', false)) return;
        this.set_temp('hard_initialized', true);
        NPC.CREATE('fb/binghuo/zhangwuxia', this);
    }
}
