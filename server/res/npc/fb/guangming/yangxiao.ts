import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '杨逍';
    title = '<hic>光明左使</hic>';
    desc = '杨逍负手立于圣火堂左侧，举止潇洒，气机深不可测。';
    hp = 145000;
    max_hp = 145000;
    mp = 50000;
    max_mp = 50000;
    score = 10;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1080], ['dodge', 1080], ['parry', 1080], ['unarmed', 1080]);
    }
}
