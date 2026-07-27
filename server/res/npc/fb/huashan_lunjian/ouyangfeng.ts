import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '欧阳锋';
    desc = '高鼻深目的老者拄着蛇杖，气息阴冷沉凝，呼吸间隐有蛙鸣震荡山谷。';
    title = '<hir>西毒</hir>';
    gender = 1;
    age = 60;
    hp = 300000;
    max_hp = 300000;
    mp = 95000;
    max_mp = 95000;
    score = 20;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1280], ['dodge', 1280], ['parry', 1280], ['unarmed', 1280], ['staff', 1280], ['hamagong', 1350, ['force', 'unarmed']], ['lingshezhangfa', 1320, ['staff', 'parry']], ['chanchubufa', 1280, 'dodge']);
    }
}
