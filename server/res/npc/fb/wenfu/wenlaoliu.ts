import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '温方禄';
    desc = '温家六兄弟中最年轻的一人，执棍守在众兄长身侧。';
    title = '<hic>石梁派高手</hic>';
    gender = 1;
    age = 44;
    hp = 12500;
    max_hp = 12500;
    mp = 5200;
    max_mp = 5200;
    score = 12;

    constructor() {
        super();
        this.skill_map(['dodge', 390], ['parry', 410], ['force', 380], ['club', 420], ['baguagun', 440, ['club', 'parry']]);
    }
}
