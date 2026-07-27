import type { USER } from '../../../../core/char/user.js';
import type { CORPSE } from '../../../../core/item/corpse.js';
import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '怜星';
    title = '<hic>移花宫二宫主</hic>';
    desc = '移花宫二宫主立在玉阶前，眉目温婉，举手投足间却暗藏凌厉杀机。';
    gender = 2;
    age = 29;
    hp = 118000;
    max_hp = 118000;
    mp = 40000;
    max_mp = 40000;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 960], ['dodge', 1000], ['parry', 960], ['unarmed', 980]);
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
