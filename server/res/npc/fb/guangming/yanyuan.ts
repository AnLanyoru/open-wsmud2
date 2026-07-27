import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '颜垣';
    title = '<hio>厚土旗掌旗使</hio>';
    desc = '厚土旗掌旗使颜垣扛着沉重铁铲，稳稳守住阵地。';
    hp = 100000;
    max_hp = 100000;
    mp = 32000;
    max_mp = 32000;
    score = 5;

    constructor() {
        super();
        this.skill_map(['force', 940], ['dodge', 900], ['parry', 950], ['staff', 950]);
    }
}
