import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '本尘';
    desc = '本尘和尚守在无乐阁中，面容肃穆，掌中暗蓄内劲。';
    hp = 150000;
    max_hp = 150000;
    mp = 52000;
    max_mp = 52000;
    score = 15;

    constructor() {
        super();
        this.skill_map(['force', 1100], ['dodge', 1080], ['parry', 1100], ['unarmed', 1100]);
    }
}
