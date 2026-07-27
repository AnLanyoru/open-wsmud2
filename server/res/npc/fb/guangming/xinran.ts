import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '辛然';
    title = '<hir>烈火旗掌旗使</hir>';
    desc = '烈火旗掌旗使辛然立在火盆之间，刀锋映着灼灼红光。';
    hp = 105000;
    max_hp = 105000;
    mp = 33000;
    max_mp = 33000;
    score = 5;

    constructor() {
        super();
        this.skill_map(['force', 960], ['dodge', 940], ['parry', 960], ['blade', 970]);
    }
}
