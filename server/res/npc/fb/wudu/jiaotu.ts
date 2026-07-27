import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '五毒教众';
    desc = '一名身着苗服的五毒教众，腰间毒囊散发着刺鼻气味。';
    gender = 1;
    age = 30;
    hp = 11000;
    max_hp = 11000;
    mp = 4800;
    max_mp = 4800;
    score = 10;

    constructor() {
        super();
        this.skill_map(['dodge', 390], ['parry', 390], ['force', 380], ['unarmed', 410], ['qianzhuwandushou', 430, 'unarmed'], ['wuduyanluobu', 410, 'dodge'], ['wudushengong', 410, 'force']);
    }
}
