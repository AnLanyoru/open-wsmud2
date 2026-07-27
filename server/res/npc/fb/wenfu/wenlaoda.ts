import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '温方达';
    desc = '温家六兄弟之首，面色阴沉，手中一根八卦棍蓄势待发。';
    title = '<hic>石梁派高手</hic>';
    gender = 1;
    age = 58;
    hp = 11000;
    max_hp = 11000;
    mp = 5000;
    max_mp = 5000;
    score = 0;

    constructor() {
        super();
        this.skill_map(['dodge', 360], ['parry', 380], ['force', 360], ['club', 400], ['baguagun', 420, ['club', 'parry']]);
    }

    on_enter(me) {
        me.notify('温老大厉声喝道：擅闯温府者，死！');
        this.do_kill(me);
    }
}
