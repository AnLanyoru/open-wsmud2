import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '本空';
    desc = '本空和尚踏前半步，指间剑气纵横，与两位师兄互为犄角。';
    hp = 165000;
    max_hp = 165000;
    mp = 60000;
    max_mp = 60000;
    score = 13;

    constructor() {
        super();
        this.skill_map(['force', 1160], ['dodge', 1140], ['parry', 1160], ['unarmed', 1180]);
    }
}
