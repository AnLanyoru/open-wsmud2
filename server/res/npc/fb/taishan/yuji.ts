import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '玉玑子';
    desc = '玉玑子横剑立在石阶中央，目光阴沉，显然不肯让人继续登山。';
    gender = 1;
    age = 58;
    hp = 18000;
    max_hp = 18000;
    mp = 5200;
    max_mp = 5200;
    score = 30;

    constructor() {
        super();
        this.skill_map(['force', 500], ['dodge', 500], ['parry', 500], ['sword', 500], ['taishanjianfa', 500, ['sword', 'parry']]);
    }
}
