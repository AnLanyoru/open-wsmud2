import { ROOM } from '../../../core/room/room.js';
import { enter_wudao_trial, cleanup_wudao_trial, wudao_trial_heartbeat } from '../../npc/pub/wudao_ss.js';

export default class extends ROOM {
    name = '白虎台';
    desc = '这里是武道塔顶部的西面平台，一座白虎的雕塑凭空而立，传说中的四大守护神兽之一。';
    exits = { east: 'wudao/ding' };
    max_item_count = 1;
    is_shadow = true;
    no_relive = true;

    on_enter(me) {
        if (me.check_player()) enter_wudao_trial(this, me, 1);
    }

    on_leave(me) {
        if (me.check_player()) cleanup_wudao_trial(this, me);
    }

    on_user_die(me, _killer) { cleanup_wudao_trial(this, me); }
    on_user_quit(me) { cleanup_wudao_trial(this, me); }
    on_heart_beat(dt) { wudao_trial_heartbeat(this, dt); }
}
