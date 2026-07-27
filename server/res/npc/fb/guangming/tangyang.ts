import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '唐洋';
    title = '<hic>洪水旗掌旗使</hic>';
    desc = '洪水旗掌旗使唐洋挥动分水刺，脚下水渠波涛翻卷。';
    hp = 105000;
    max_hp = 105000;
    mp = 34000;
    max_mp = 34000;
    score = 5;

    constructor() {
        super();
        this.skill_map(['force', 960], ['dodge', 970], ['parry', 950], ['sword', 960]);
    }
}
