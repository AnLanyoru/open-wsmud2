import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '嵩山太保';
    desc = '这名嵩山太保内息深厚，剑锋寒气逼人，显然是众太保中的强手。';
    gender = 1;
    age = 46;
    hp = 21000;
    max_hp = 21000;
    mp = 6500;
    max_mp = 6500;
    score = 6;

    constructor() {
        super();
        this.skill_map(['force', 590], ['dodge', 590], ['parry', 590], ['sword', 590], ['songshanjianfa', 590, ['sword', 'parry']], ['hanbingzhenqi', 590, 'force']);
    }
}
