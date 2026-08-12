import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';
import type { CHARACTER } from '../../../../core/char/character.js';

export default class extends ROOM {
    name = '邀月宫';
    desc = '殿内寒玉生辉，银白花丛环绕玉座，邀月宫主端坐其中，气息冷若霜雪。';
    exits = {
        northeast: 'fb/yihua/changlang1',
        southeast: 'fb/yihua/woshi',
    };

    constructor() {
        super();
        this.set_npc('fb/yihua/yaoyue');
    }

    on_enter(me: USER) {
        if (!me.is_player || this.fb_query_temp('diff', me, 0) !== 1 || this.fb_query_temp('yihua_dual_lords', me, false)) return;
        const otherRoom = this.query('fb/yihua/lianxing');
        const other = otherRoom?.find_by_path('fb/yihua/lianxing') as CHARACTER | undefined;
        if (!other) return;
        this.fb_set_temp('yihua_dual_lords', true, me);
        other.moveto(this);
        me.notify('困难模式下怜星闻讯赶来，与邀月联手迎敌。');
    }
}
