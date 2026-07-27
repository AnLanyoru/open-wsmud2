import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '烛九阴';
    desc = '烛九阴龙身盘绕谷底，呼吸间交替涌出极寒与炽炎，开阖的巨目映照出昼夜轮转。';
    title = '<hir>烛龙</hir>';
    gender = 0;
    age = 3000;
    hp = 1200000;
    max_hp = 1200000;
    mp = 420000;
    max_mp = 420000;
    score = 40;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1950], ['dodge', 1900], ['parry', 1950], ['unarmed', 2000]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
