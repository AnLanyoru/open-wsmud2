import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '余沧海';
    desc = '青城掌门余沧海身材矮小，双目精光闪烁，掌剑变幻莫测。';
    title = '青城派掌门';
    gender = 1;
    age = 55;
    hp = 28000;
    max_hp = 28000;
    mp = 12000;
    max_mp = 12000;
    pfm_rate = 1;
    score = 60;

    constructor() {
        super();
        this.skill_map(['dodge', 620], ['parry', 640], ['force', 600], ['sword', 660], ['unarmed', 640], ['songfengjianfa', 700, ['sword', 'parry']], ['cuixinzhang', 680, 'unarmed'], ['tagexing', 660, 'dodge']);
    }

    on_enter(me) {
        me.notify('余沧海冷笑道：既然闯到上清殿，就把命留下！');
        this.do_kill(me);
    }
}
