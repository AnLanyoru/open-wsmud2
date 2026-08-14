import { ROOM } from '../../../core/room/room.js';
import { enter_wudao_trial, cleanup_wudao_trial, wudao_trial_heartbeat } from '../../npc/pub/wudao_ss.js';

export default class extends ROOM {
    name = '玄武台';
    desc = '这里是武道塔顶部的北面平台，一座玄武的雕塑凭空而立，传说中的四大守护神兽之一。';
    exits = { south: 'wudao/ding' };
    max_item_count = 1;
    is_shadow = true;
    no_relive = true;

    on_enter(me) {
        if (me.check_player()) enter_wudao_trial(this, me, 2);
    }

    on_leave(me) {
        if (me.check_player()) cleanup_wudao_trial(this, me);
    }

    on_heart_beat(dt) { wudao_trial_heartbeat(this, dt); }
}
