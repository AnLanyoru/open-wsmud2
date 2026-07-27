import { MONSTER } from '../../../../core/char/monster.js';

export default class extends MONSTER {
    name = '炎龙';
    desc = '赤红巨蜥伏在滚烫岩石上，口鼻不断喷出火星，粗壮尾巴扫得碎石四处飞溅。';
    hp = 38000;
    max_hp = 38000;
    mp = 7000;
    max_mp = 7000;
    score = 10;

    constructor() {
        super();
        this.skill_map(['bite', 700]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
