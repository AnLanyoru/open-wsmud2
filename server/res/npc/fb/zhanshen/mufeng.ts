import { NPC } from '../../../../core/char/npc.js';
import type { USER } from '../../../../core/char/user.js';
import type { CORPSE } from '../../../../core/item/corpse.js';

export default class extends NPC {
    name = '木凤';
    desc = '青木神鸟羽翼如垂天之云，翎羽间流转不息的生机令寻常控制手段难以近身。';
    title = '<hig>东方神木</hig>';
    gender = 2;
    age = 3000;
    hp = 1300000;
    max_hp = 1300000;
    mp = 480000;
    max_mp = 480000;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 2050], ['dodge', 2200], ['parry', 2050], ['unarmed', 2100]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }

    on_died(killer: USER | undefined, _corpse: CORPSE) {
        if (!killer || !this.die_room) return;
        this.die_room.fb_set_temp('zhanshen_wood', true, killer);
        if (this.die_room.fb_query_temp('zhanshen_difficulty', killer, 0) === 0) {
            killer.add_fbscore(30, 100);
            killer.notify('<hig>木凤化作一只蕴含神力的鸟窝，你将它穿戴在身上。</hig>');
        } else {
            killer.notify('<hig>木凤消散后留下一枚木行石。</hig>');
        }
    }
}
