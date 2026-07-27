import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '说不得';
    desc = '布袋和尚说不得挡在灭绝师太身前，宽大布袋鼓荡不休。';
    hp = 120000;
    max_hp = 120000;
    mp = 38000;
    max_mp = 38000;
    score = 10;

    constructor() {
        super();
        this.skill_map(['force', 1000], ['dodge', 1000], ['parry', 1000], ['unarmed', 1000]);
    }
}
