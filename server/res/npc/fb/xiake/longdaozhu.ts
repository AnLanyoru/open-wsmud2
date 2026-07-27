import type { CORPSE } from '../../../../core/item/corpse.js';
import type { USER } from '../../../../core/char/user.js';
import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '龙岛主';
    desc = '白须老者身披黄袍，神态温和从容，双掌间却蕴藏着深不可测的内力。';
    title = '<hiy>侠客岛岛主</hiy>';
    gender = 1;
    age = 72;
    hp = 390000;
    max_hp = 390000;
    mp = 130000;
    max_mp = 130000;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1500], ['dodge', 1450], ['parry', 1500], ['unarmed', 1500], ['taixuangong', 1550, ['force', 'unarmed', 'parry']], ['xuanxubu', 1480, 'dodge']);
    }

    on_enter(me) {
        if (me.is_player && this.environment?.fb_query_temp('xiake_route', me, '') === 'punish' && !this.fight_type) this.do_kill(me);
    }

    on_died(killer: USER | undefined, _corpse: CORPSE) {
        if (killer && this.die_room?.fb_query_temp('xiake_route', killer, '') === 'punish') killer.add_fbscore(35, 100);
    }
}
