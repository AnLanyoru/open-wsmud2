import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '庄铮';
    title = '<hiy>锐金旗掌旗使</hiy>';
    desc = '锐金旗掌旗使庄铮提着厚背长刀，浑身杀气凛然。';
    hp = 105000;
    max_hp = 105000;
    mp = 33000;
    max_mp = 33000;
    score = 5;

    constructor() {
        super();
        this.skill_map(['force', 960], ['dodge', 920], ['parry', 960], ['blade', 970]);
    }
}
