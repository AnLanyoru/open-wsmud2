import { NPC } from '../../../../core/char/npc.js';
import type { USER } from '../../../../core/char/user.js';
import type { CORPSE } from '../../../../core/item/corpse.js';

export default class extends NPC {
    name = '兵主蚩尤';
    desc = '蚩尤身披兽面重甲，九黎凶兵缠绕血色雷霆，远古兵主的威势让整块悬空神石不断震颤。';
    title = '<ord>九黎兵主</ord>';
    gender = 1;
    age = 5000;
    hp = 1800000;
    max_hp = 1800000;
    mp = 650000;
    max_mp = 650000;
    score = 0;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(
            ['force', 2250],
            ['dodge', 2150],
            ['parry', 2250],
            ['unarmed', 2300],
            ['blade', 2300],
        );
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }

    on_died(killer: USER | undefined, _corpse: CORPSE) {
        if (!killer || !this.die_room) return;
        if (this.die_room.fb_query_temp('zhanshen_chiyou', killer, false)) return;
        this.die_room.fb_set_temp('zhanshen_chiyou', true, killer);
        killer.add_fbscore(30, 100);
        killer.notify('<ord>兵主蚩尤化入血色雷云，九重天的登临之路就此开启。</ord>');
    }
}
