import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '本因';
    desc = '本因方丈袍袖一振，凝聚雄浑指力封住退路。';
    hp = 175000;
    max_hp = 175000;
    mp = 62000;
    max_mp = 62000;
    score = 13;

    constructor() {
        super();
        this.skill_map(['force', 1180], ['dodge', 1160], ['parry', 1180], ['unarmed', 1200]);
    }
}
