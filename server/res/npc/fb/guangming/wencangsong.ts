import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '闻苍松';
    title = '<hig>巨木旗掌旗使</hig>';
    desc = '巨木旗掌旗使闻苍松手执木杖，身后旗帜猎猎作响。';
    hp = 100000;
    max_hp = 100000;
    mp = 32000;
    max_mp = 32000;
    score = 5;

    constructor() {
        super();
        this.skill_map(['force', 940], ['dodge', 920], ['parry', 940], ['staff', 950]);
    }
}
