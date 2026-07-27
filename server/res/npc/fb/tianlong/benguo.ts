import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '本果';
    desc = '本果和尚催动六脉剑气，凌厉指风破空而来。';
    hp = 165000;
    max_hp = 165000;
    mp = 60000;
    max_mp = 60000;
    score = 14;

    constructor() {
        super();
        this.skill_map(['force', 1160], ['dodge', 1140], ['parry', 1160], ['unarmed', 1180]);
    }
}
