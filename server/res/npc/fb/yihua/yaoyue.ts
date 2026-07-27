import type { USER } from '../../../../core/char/user.js';
import type { CORPSE } from '../../../../core/item/corpse.js';
import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '邀月';
    title = '<him>移花宫大宫主</him>';
    desc = '移花宫大宫主端坐花影之间，容色绝世，目光却冷得令人不敢逼视。';
    gender = 2;
    age = 32;
    hp = 125000;
    max_hp = 125000;
    mp = 42000;
    max_mp = 42000;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 980], ['dodge', 980], ['parry', 980], ['unarmed', 1000]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }

    on_died(me: USER | undefined, _corpse: CORPSE) {
        if (!me || !this.die_room || this.die_room.fb_query_temp('yihua_palace', me, false)) return;
        this.die_room.fb_set_temp('yihua_palace', true, me);
        me.add_fbscore(30);
    }
}
