import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '范遥';
    title = '<hic>光明右使</hic>';
    desc = '范遥按剑守在圣火堂右侧，沉默中透出凌厉锋芒。';
    hp = 145000;
    max_hp = 145000;
    mp = 50000;
    max_mp = 50000;
    score = 10;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1080], ['dodge', 1080], ['parry', 1080], ['sword', 1080]);
    }
}
