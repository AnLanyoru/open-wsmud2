import { NPC } from '../../../../core/char/npc.js';
import type { USER } from '../../../../core/char/user.js';
import type { CORPSE } from '../../../../core/item/corpse.js';

export default class extends NPC {
    name = '魔龙';
    desc = '漆黑龙躯盘踞水雾之中，鳞片吞没四周光线，怒吼声令整座地下水脉随之震荡。';
    title = '<hic>北冥水主</hic>';
    gender = 1;
    age = 5000;
    hp = 1400000;
    max_hp = 1400000;
    mp = 520000;
    max_mp = 520000;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 2150], ['dodge', 2050], ['parry', 2150], ['unarmed', 2200]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }

    on_died(killer: USER | undefined, _corpse: CORPSE) {
        if (!killer || !this.die_room) return;
        this.die_room.fb_set_temp('zhanshen_water', true, killer);
        if (this.die_room.fb_query_temp('zhanshen_difficulty', killer, 0) === 0) {
            killer.add_fbscore(30, 100);
            killer.notify('<hic>魔龙伏诛，地下河水分开一条通往彼岸的道路。</hic>');
        } else {
            killer.notify('<hic>魔龙沉入水底，留下一枚水行石。</hic>');
        }
    }
}
