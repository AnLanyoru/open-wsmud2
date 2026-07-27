import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '本参';
    desc = '本参和尚双指并拢，守在无常阁前，指尖隐现剑气。';
    hp = 155000;
    max_hp = 155000;
    mp = 54000;
    max_mp = 54000;
    score = 15;

    constructor() {
        super();
        this.skill_map(['force', 1120], ['dodge', 1100], ['parry', 1120], ['unarmed', 1120]);
    }
}
