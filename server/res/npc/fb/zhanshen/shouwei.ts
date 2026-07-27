import { NPC } from '../../../../core/char/npc.js';
import type { USER } from '../../../../core/char/user.js';
import type { CORPSE } from '../../../../core/item/corpse.js';

export default class extends NPC {
    name = '神殿守卫';
    desc = '远古守卫身披青铜战甲，面容隐在星光之后，手中长戈散发着历经万战的肃杀之气。';
    gender = 1;
    age = 2000;
    hp = 420000;
    max_hp = 420000;
    mp = 150000;
    max_mp = 150000;

    constructor() {
        super();
        this.skill_map(['force', 1800], ['dodge', 1750], ['parry', 1800], ['club', 1850]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }

    on_died(killer: USER | undefined, _corpse: CORPSE) {
        if (!killer || !this.die_room) return;
        const wave = this.query_temp('zhanshen_wave', 0) as number;
        const left = this.die_room.items.some(item => item.path === this.path);
        if (left) return;
        if (wave < 3) {
            this.die_room.fb_set_temp('zhanshen_guard_wave', wave + 1, killer);
            killer.notify('<hic>这一波守卫尽数倒下，前方又传来整齐的甲胄声。</hic>');
            return;
        }
        const started = this.die_room.fb_query_temp('zhanshen_guard_started', killer, 0) as number;
        const limit = this.die_room.fb_query_temp('zhanshen_guard_limit', killer, 0) as number;
        if (!started || Date.now() - started > limit * 1000) {
            this.die_room.fb_set_temp('zhanshen_guard_wave', 1, killer);
            killer.notify('<hir>三波守卫的计时已经耗尽，星阵逆转，必须从第一波重新挑战。</hir>');
            return;
        }
        this.die_room.fb_set_temp('zhanshen_guard_wave', 4, killer);
        this.die_room.fb_set_temp('zhanshen_guards_done', true, killer);
        killer.add_fbscore(40, 100);
        killer.notify('<hic>三波守卫尽数伏诛，地面浮现出通往战神殿暗道的八卦方位。</hic>');
    }
}
