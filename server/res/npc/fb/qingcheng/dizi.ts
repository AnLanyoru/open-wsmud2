import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '青城弟子';
    desc = '一名青城弟子按剑守路，松风剑法的起手式已然展开。';
    gender = 1;
    age = 28;
    hp = 15000;
    max_hp = 15000;
    mp = 6500;
    max_mp = 6500;
    score = 10;

    constructor() {
        super();
        this.skill_map(['dodge', 460], ['parry', 470], ['force', 450], ['sword', 490], ['songfengjianfa', 510, ['sword', 'parry']], ['tagexing', 490, 'dodge']);
    }
}
