import type { CORPSE } from '../../../../core/item/corpse.js';
import type { USER } from '../../../../core/char/user.js';
import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '木岛主';
    desc = '青袍老者目光如电，与龙岛主并肩而立，举手之间已有封锁退路之势。';
    title = '<hiy>侠客岛岛主</hiy>';
    gender = 1;
    age = 70;
    hp = 380000;
    max_hp = 380000;
    mp = 125000;
    max_mp = 125000;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1480], ['dodge', 1480], ['parry', 1480], ['unarmed', 1480], ['taixuangong', 1530, ['force', 'unarmed', 'parry']], ['xuanxubu', 1500, 'dodge']);
    }

    on_enter(me) {
        if (me.is_player && this.environment?.fb_query_temp('xiake_route', me, '') === 'punish' && !this.fight_type) this.do_kill(me);
    }

    on_died(killer: USER | undefined, _corpse: CORPSE) {
        if (killer && this.die_room?.fb_query_temp('xiake_route', killer, '') === 'punish') killer.add_fbscore(35, 100);
    }
}
