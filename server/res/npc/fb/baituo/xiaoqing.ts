import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '小青';
    desc = '青衣少女独坐花间，神色戒备，却似乎并不愿主动卷入山庄中的厮杀。';
    gender = 2;
    age = 18;
    hp = 28000;
    max_hp = 28000;
    mp = 8000;
    max_mp = 8000;

    constructor() {
        super();
        this.skill_map(['force', 600], ['dodge', 600], ['parry', 600], ['sword', 600]);
    }
}
