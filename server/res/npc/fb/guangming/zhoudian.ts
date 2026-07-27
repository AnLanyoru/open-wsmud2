import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '周颠';
    desc = '周颠拦在林间小路上，嘴里骂骂咧咧，双掌蓄势待发。';
    hp = 100000;
    max_hp = 100000;
    mp = 33000;
    max_mp = 33000;
    score = 5;

    constructor() {
        super();
        this.skill_map(['force', 940], ['dodge', 940], ['parry', 940], ['unarmed', 940]);
    }
}
