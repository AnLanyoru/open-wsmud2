import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '幽荧';
    desc = '幽荧形如披着冰晶的异兽，周身幽蓝火焰没有温度，所过之处连空气都凝成白霜。';
    title = '<hic>太阴幽荧</hic>';
    gender = 0;
    age = 900;
    hp = 780000;
    max_hp = 780000;
    mp = 260000;
    max_mp = 260000;
    score = 30;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1750], ['dodge', 1700], ['parry', 1750], ['unarmed', 1800]);
    }
}
