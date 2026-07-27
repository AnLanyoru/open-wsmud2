import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '温方悟';
    desc = '温家五老之一，身形精悍，出手阴狠迅疾。';
    title = '<hic>石梁派高手</hic>';
    gender = 1;
    age = 47;
    hp = 12500;
    max_hp = 12500;
    mp = 5200;
    max_mp = 5200;
    score = 12;

    constructor() {
        super();
        this.skill_map(['dodge', 400], ['parry', 400], ['force', 380], ['unarmed', 420], ['baguaquan', 440, ['unarmed', 'parry']]);
    }
}
