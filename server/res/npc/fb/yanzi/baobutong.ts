import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '包不同';
    desc = '灰衣汉子叉手挡在庄门前，满脸不服之色，张口便是一句“非也非也”。';
    gender = 1;
    age = 42;
    hp = 90000;
    max_hp = 90000;
    mp = 28000;
    max_mp = 28000;
    score = 15;

    constructor() {
        super();
        this.skill_map(['force', 900], ['dodge', 900], ['parry', 900], ['unarmed', 920]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
