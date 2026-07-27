import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '嵩山太保';
    desc = '一名嵩山太保按剑拦路，进退之间隐隐与同门结成剑阵。';
    gender = 1;
    age = 38;
    hp = 17000;
    max_hp = 17000;
    mp = 5200;
    max_mp = 5200;
    score = 6;

    constructor() {
        super();
        this.skill_map(['force', 540], ['dodge', 540], ['parry', 540], ['sword', 540], ['songshanjianfa', 540, ['sword', 'parry']]);
    }
}
