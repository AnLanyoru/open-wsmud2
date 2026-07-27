import type { CORPSE } from '../../../../core/item/corpse.js';
import type { USER } from '../../../../core/char/user.js';
import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '罚恶守卫';
    desc = '黑衣守卫腰悬铜牌，手按刀柄，奉岛主之命惩戒闯岛恶客。';
    title = '<hic>侠客岛守卫</hic>';
    gender = 1;
    age = 38;
    hp = 190000;
    max_hp = 190000;
    mp = 55000;
    max_mp = 55000;

    constructor() {
        super();
        this.skill_map(['force', 1150], ['dodge', 1150], ['parry', 1150], ['blade', 1150], ['unarmed', 1100]);
    }

    on_enter(me) {
        if (me.is_player && this.environment?.fb_query_temp('xiake_route', me, '') === 'punish' && !this.fight_type) this.do_kill(me);
    }

    on_died(killer: USER | undefined, _corpse: CORPSE) {
        if (killer && this.die_room?.fb_query_temp('xiake_route', killer, '') === 'punish') killer.add_fbscore(10, 100);
    }
}
