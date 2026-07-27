import { MONSTER } from '../../../../core/char/monster.js';

export default class extends MONSTER {
    name = '毒蛇';
    desc = '一条色彩斑斓的毒蛇盘在草叶间，三角形的蛇首随着脚步声缓缓昂起。';
    hp = 26000;
    max_hp = 26000;
    mp = 4000;
    max_mp = 4000;
    score = 10;

    constructor() {
        super();
        this.skill_map(['bite', 600]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
