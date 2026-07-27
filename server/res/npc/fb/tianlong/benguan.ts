import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '本观';
    desc = '本观和尚合十立于无我阁中，袈裟无风自动。';
    hp = 150000;
    max_hp = 150000;
    mp = 52000;
    max_mp = 52000;
    score = 15;

    constructor() {
        super();
        this.skill_map(['force', 1100], ['dodge', 1080], ['parry', 1100], ['unarmed', 1100]);
    }
}
