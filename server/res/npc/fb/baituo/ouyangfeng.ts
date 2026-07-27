import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '欧阳锋';
    desc = '白衣高鼻的老者手持蛇杖，双目如电，举手投足间尽是西域宗师气度。';
    title = '<hiy>西毒</hiy>';
    gender = 1;
    age = 55;
    hp = 58000;
    max_hp = 58000;
    mp = 19000;
    max_mp = 19000;
    score = 40;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 780], ['dodge', 780], ['parry', 780], ['unarmed', 780], ['staff', 780]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
