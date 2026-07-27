import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '左冷禅';
    desc = '左冷禅端坐堂上，双掌寒气缭绕，一双鹰目冷冷注视着来人。';
    title = '嵩山派掌门';
    gender = 1;
    age = 55;
    hp = 32000;
    max_hp = 32000;
    mp = 10000;
    max_mp = 10000;
    score = 40;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 680], ['dodge', 680], ['parry', 680], ['sword', 680], ['unarmed', 680], ['songshanjianfa', 680, ['sword', 'parry']], ['hanbingzhenqi', 680, 'force']);
    }
}
