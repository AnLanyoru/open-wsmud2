import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '张中';
    title = '<hiy>五散人·铁冠道人</hiy>';
    desc = '铁冠道人张中横剑立在山腰，目光锐利地审视来客。';
    hp = 95000;
    max_hp = 95000;
    mp = 32000;
    max_mp = 32000;
    score = 5;

    constructor() {
        super();
        this.skill_map(['force', 920], ['dodge', 920], ['parry', 920], ['sword', 920]);
    }
}
