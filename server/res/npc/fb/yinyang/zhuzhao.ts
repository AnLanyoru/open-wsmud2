import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '烛照';
    desc = '烛照通体流淌着金色烈焰，双眸如两轮烈日，炽热威压令洞窟岩壁不断崩裂。';
    title = '<hiy>太阳烛照</hiy>';
    gender = 0;
    age = 1200;
    hp = 880000;
    max_hp = 880000;
    mp = 300000;
    max_mp = 300000;
    score = 30;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1800], ['dodge', 1800], ['parry', 1800], ['unarmed', 1850]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
