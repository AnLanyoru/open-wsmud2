import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '独孤求败';
    title = '<hir>剑魔</hir>';
    desc = '剑魔虚影背负玄铁重剑，浩荡剑压令整座剑冢为之震颤。';
    gender = 3;
    hp = 420000;
    max_hp = 420000;
    mp = 150000;
    max_mp = 150000;
    score = 70;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1500], ['dodge', 1500], ['parry', 1520], ['sword', 1540]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
