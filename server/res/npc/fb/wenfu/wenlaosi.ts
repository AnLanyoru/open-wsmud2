import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '温方施';
    desc = '温家五老之一，持棍横立，封住了前路。';
    title = '<hic>石梁派高手</hic>';
    gender = 1;
    age = 50;
    hp = 12500;
    max_hp = 12500;
    mp = 5200;
    max_mp = 5200;
    score = 12;

    constructor() {
        super();
        this.skill_map(['dodge', 380], ['parry', 400], ['force', 380], ['club', 420], ['baguagun', 440, ['club', 'parry']]);
    }
}
