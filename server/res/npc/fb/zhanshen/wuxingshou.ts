import { NPC } from '../../../../core/char/npc.js';
import type { USER } from '../../../../core/char/user.js';
import type { CORPSE } from '../../../../core/item/corpse.js';

export default class extends NPC {
    name = '五行兽';
    desc = '由五行灵气凝成的异兽，身形在矿石与烈焰之间不断变幻。';
    title = '<hiy>五行灵兽</hiy>';
    gender = 1;
    age = 2000;
    hp = 1200000;
    max_hp = 1200000;
    mp = 420000;
    max_mp = 420000;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 2050], ['dodge', 2000], ['parry', 2050], ['unarmed', 2100]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }

    on_died(killer: USER | undefined, _corpse: CORPSE) {
        if (!killer || !this.die_room) return;
        const element = this.query_temp('zhanshen_element', '') as string;
        if (element === 'metal') {
            this.die_room.fb_set_temp('zhanshen_metal', true, killer);
            killer.notify('<hiy>矿脉异兽崩散，留下一枚金行石。</hiy>');
        } else if (element === 'fire') {
            this.die_room.fb_set_temp('zhanshen_fire', true, killer);
            killer.notify('<hir>融火异兽化作飞灰，留下一枚火行石。</hir>');
        }
    }
}
