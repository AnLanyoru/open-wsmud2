import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '嵩山弟子';
    desc = '一名手持长剑的嵩山弟子，神色倨傲，正奉命把守刘府。';
    gender = 1;
    age = 28;
    hp = 9000;
    max_hp = 9000;
    mp = 2400;
    max_mp = 2400;
    score = 15;

    constructor() {
        super();
        this.skill_map(
            ['force', 380],
            ['dodge', 380],
            ['parry', 380],
            ['sword', 380],
            ['songshanjianfa', 380, ['sword', 'parry']],
        );
    }
}
