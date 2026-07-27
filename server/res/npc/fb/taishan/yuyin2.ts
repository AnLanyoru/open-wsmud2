import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '玉音子';
    desc = '玉音子端坐玉皇顶，见有人闯来便缓缓起身，周身剑气森然。';
    gender = 1;
    age = 64;
    hp = 25000;
    max_hp = 25000;
    mp = 7200;
    max_mp = 7200;
    score = 40;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 580], ['dodge', 580], ['parry', 580], ['sword', 580], ['taishanjianfa', 580, ['sword', 'parry']]);
    }
}
