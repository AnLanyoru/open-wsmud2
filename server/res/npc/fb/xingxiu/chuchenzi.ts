import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '出尘子';
    desc = '出尘子手执拂尘站在芦苇间，面貌清癯，眼底却闪动着阴狠毒辣的光芒。';
    gender = 1;
    age = 38;
    hp = 37000;
    max_hp = 37000;
    mp = 10500;
    max_mp = 10500;

    constructor() {
        super();
        this.skill_map(['force', 670], ['dodge', 670], ['parry', 670], ['whip', 670]);
    }
}
