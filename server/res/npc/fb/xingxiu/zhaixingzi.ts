import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '摘星子';
    desc = '星宿派大弟子负手而立，神情倨傲，见到外人便露出一丝阴冷笑意。';
    gender = 1;
    age = 34;
    hp = 38000;
    max_hp = 38000;
    mp = 11000;
    max_mp = 11000;

    constructor() {
        super();
        this.skill_map(['force', 680], ['dodge', 680], ['parry', 680], ['unarmed', 680]);
    }
}
