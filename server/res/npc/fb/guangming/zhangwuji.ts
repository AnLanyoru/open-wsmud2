import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '张无忌';
    title = '<hiy>明教教主</hiy>';
    desc = '张无忌站在熊熊圣火之前，神色温和，周身真气却如渊似海。';
    hp = 190000;
    max_hp = 190000;
    mp = 70000;
    max_mp = 70000;
    score = 20;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1180], ['dodge', 1180], ['parry', 1180], ['unarmed', 1180]);
    }
}
