import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '彭莹玉';
    desc = '彭和尚持杖护住山顶要道，神情坚毅，寸步不让。';
    hp = 120000;
    max_hp = 120000;
    mp = 38000;
    max_mp = 38000;
    score = 10;

    constructor() {
        super();
        this.skill_map(['force', 1000], ['dodge', 980], ['parry', 1010], ['staff', 1010]);
    }
}
