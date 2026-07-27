import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '慕容复';
    desc = '慕容公子负手立于书案前，神态从容，周身真气流转不息。';
    title = '<hiy>南慕容</hiy>';
    gender = 1;
    age = 29;
    hp = 145000;
    max_hp = 145000;
    mp = 48000;
    max_mp = 48000;
    score = 30;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1050], ['dodge', 1040], ['parry', 1080], ['sword', 1050], ['unarmed', 1050]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
