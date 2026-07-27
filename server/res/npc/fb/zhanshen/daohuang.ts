import { NPC } from '../../../../core/char/npc.js';
import type { USER } from '../../../../core/char/user.js';
import type { CORPSE } from '../../../../core/item/corpse.js';

export default class extends NPC {
    name = '刀皇';
    desc = '刀皇怀抱古刀端坐王座，双眼开阖间刀光纵横，仿佛世间一切招式都能被他一刀斩断。';
    title = '<hio>万刀之皇</hio>';
    gender = 1;
    age = 600;
    hp = 1500000;
    max_hp = 1500000;
    mp = 520000;
    max_mp = 520000;
    score = 30;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 2100], ['dodge', 2050], ['parry', 2150], ['blade', 2200]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }

    on_die(killer: USER | undefined) {
        if (!killer || !this.environment) return;
        const lives = this.environment.fb_query_temp('zhanshen_daohuang_lives', killer, 2) - 1;
        this.environment.fb_set_temp('zhanshen_daohuang_lives', lives, killer);
        if (lives > 0) {
            this.hp = this.max_hp;
            this.mp = this.max_mp;
            killer.notify('<hio>刀皇的第一重刀意破碎，古刀出鞘，第二条命随之苏醒！</hio>');
            return false;
        }
    }

    on_died(killer: USER | undefined, _corpse: CORPSE) {
        if (!killer || !this.die_room) return;
        this.die_room.fb_set_temp('zhanshen_daohuang', true, killer);
        killer.notify('<hio>刀皇两度凝聚的刀意终于消散，通往兵主蚩尤的天外石阶显现。</hio>');
    }
}
