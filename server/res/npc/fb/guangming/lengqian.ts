import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '冷谦';
    title = '<hic>五散人·冷面先生</hic>';
    desc = '冷面先生冷谦持剑守住山亭，神色冷峻，一言不发。';
    hp = 90000;
    max_hp = 90000;
    mp = 30000;
    max_mp = 30000;
    score = 5;

    constructor() {
        super();
        this.skill_map(['force', 900], ['dodge', 900], ['parry', 900], ['sword', 900]);
    }
}
