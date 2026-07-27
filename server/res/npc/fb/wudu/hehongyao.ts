import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '何红药';
    desc = '她脸覆疤痕，神色怨毒，举手投足间带着浓烈毒气。';
    gender = 2;
    age = 40;
    hp = 19000;
    max_hp = 19000;
    mp = 8000;
    max_mp = 8000;
    score = 0;

    constructor() {
        super();
        this.skill_map(['dodge', 500], ['parry', 500], ['force', 480], ['unarmed', 520], ['qianzhuwandushou', 550, ['unarmed', 'parry']], ['wuduyanluobu', 520, 'dodge'], ['wudushengong', 520, 'force']);
        this.set_drop({ obj: 'eq/lv2/wd_tou', odds: 3000 });
    }
}
