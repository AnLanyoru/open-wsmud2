import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '夏雪宜';
    desc = '他面容俊秀而神情邪异，金蛇剑斜指地面，剑光如蛇信吞吐。';
    title = '<hiy>金蛇郎君</hiy>';
    gender = 1;
    age = 35;
    hp = 18000;
    max_hp = 18000;
    mp = 8000;
    max_mp = 8000;
    pfm_rate = 1;
    score = 40;

    constructor() {
        super();
        this.set_objects(['eq/lv3/jinshejian', 1, 1]);
        this.skill_map(['dodge', 480], ['parry', 500], ['force', 480], ['sword', 520], ['unarmed', 500], ['jinshejianfa', 560, ['sword', 'parry']], ['jinshezhang', 520, 'unarmed'], ['jinsheyoushenbu', 520, 'dodge']);
    }
}
