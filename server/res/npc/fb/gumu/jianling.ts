import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '剑灵';
    title = '<mag>独孤剑意</mag>';
    desc = '一道由万千残剑锋芒汇成的虚影悬在剑冢上空，剑意森寒。';
    gender = 3;
    hp = 300000;
    max_hp = 300000;
    mp = 110000;
    max_mp = 110000;
    score = 70;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1380], ['dodge', 1420], ['parry', 1400], ['sword', 1420]);
    }
}
