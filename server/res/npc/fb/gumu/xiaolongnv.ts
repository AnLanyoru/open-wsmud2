import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '小龙女';
    title = '<hic>古墓派掌门</hic>';
    desc = '小龙女一袭白衣，清冷如月，手中金铃索微微轻响。';
    gender = 2;
    hp = 220000;
    max_hp = 220000;
    mp = 85000;
    max_mp = 85000;
    score = 30;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1280], ['dodge', 1320], ['parry', 1280], ['whip', 1300]);
    }
}
