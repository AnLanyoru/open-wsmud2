import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '花无缺';
    desc = '白衣公子静立暗室，面容俊秀无瑕，掌势含而不发，气机已锁定来人。';
    gender = 1;
    age = 20;
    hp = 135000;
    max_hp = 135000;
    mp = 45000;
    max_mp = 45000;
    score = 40;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1020], ['dodge', 1020], ['parry', 1020], ['unarmed', 1040]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
