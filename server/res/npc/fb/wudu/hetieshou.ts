import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '何铁手';
    desc = '她容貌艳丽，右手却装着寒光闪闪的铁钩，笑意中暗藏杀机。';
    title = '五毒教主';
    gender = 2;
    age = 28;
    hp = 22000;
    max_hp = 22000;
    mp = 9000;
    max_mp = 9000;
    pfm_rate = 1;
    score = 0;

    constructor() {
        super();
        this.skill_map(['dodge', 540], ['parry', 540], ['force', 520], ['sword', 560], ['unarmed', 540], ['wudugoufa', 580, ['sword', 'parry']], ['qianzhuwandushou', 560, 'unarmed'], ['wuduyanluobu', 560, 'dodge'], ['wudushengong', 560, 'force']);
    }
}
