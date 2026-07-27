import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '一灯大师';
    desc = '白眉僧人神情慈和，指尖却凝着纯厚真气，袈裟在凛冽峰风中纹丝不动。';
    title = '<hig>南帝</hig>';
    gender = 1;
    age = 65;
    hp = 290000;
    max_hp = 290000;
    mp = 100000;
    max_mp = 100000;
    score = 20;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1300], ['dodge', 1250], ['parry', 1300], ['unarmed', 1300], ['sword', 1200], ['yiyangzhi', 1360, ['unarmed', 'parry']], ['kumushengong', 1320, 'force'], ['tiannanbu', 1260, 'dodge']);
    }
}
