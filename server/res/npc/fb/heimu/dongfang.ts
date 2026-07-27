import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '东方不败';
    desc = '红衣人端坐绣架之前，指间银针微颤，身影似真似幻，令人无从捉摸。';
    title = '<hiy>日出东方，唯我不败</hiy>';
    gender = 2;
    age = 43;
    hp = 245000;
    max_hp = 245000;
    mp = 85000;
    max_mp = 85000;
    score = 40;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1260], ['dodge', 1320], ['parry', 1240], ['sword', 1280], ['throwing', 1320]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
