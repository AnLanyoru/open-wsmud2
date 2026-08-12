import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends ROOM {
    name = '怜星宫';
    desc = '柔和灯火照着淡蓝花丛，怜星立于玉阶之前，温婉眉目间隐含凛冽杀意。';
    exits = {
        northwest: 'fb/yihua/changlang1',
        southwest: 'fb/yihua/woshi',
    };

    constructor() {
        super();
        this.set_npc('fb/yihua/lianxing');
    }

    on_enter(me: USER) {
        if (!me.is_player || this.fb_query_temp('diff', me, 0) !== 1 || this.fb_query_temp('yihua_dual_lords', me, false)) return;
        const otherRoom = this.query('fb/yihua/yaoyue');
        const other = otherRoom?.find_by_path('fb/yihua/yaoyue') as CHARACTER | undefined;
        if (!other) return;
        this.fb_set_temp('yihua_dual_lords', true, me);
        other.moveto(this);
        me.notify('困难模式下邀月闻讯赶来，与怜星联手迎敌。');
    }
}
