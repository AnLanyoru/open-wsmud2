import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '温方山';
    desc = '温家五老之一，目光狠厉，掌间暗藏劲力。';
    title = '<hic>石梁派高手</hic>';
    gender = 1;
    age = 52;
    hp = 12500;
    max_hp = 12500;
    mp = 5200;
    max_mp = 5200;
    score = 12;

    constructor() {
        super();
        this.skill_map(['dodge', 380], ['parry', 400], ['force', 380], ['unarmed', 420], ['baguaquan', 440, ['unarmed', 'parry']]);
    }
}
