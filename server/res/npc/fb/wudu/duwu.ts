import { MONSTER } from '../../../../core/char/monster.js';

export default class extends MONSTER {
    name = '五毒';
    desc = '一只被五毒教秘法饲养的剧毒异虫，斑斓外壳令人望而生畏。';
    gender = 1;
    hp = 10000;
    max_hp = 10000;
    mp = 3000;
    max_mp = 3000;
    score = 6;

    constructor() {
        super();
        this.skill_map(['dodge', 400], ['bite', 430], ['bite2', 430, 'bite']);
    }

    on_enter(me) {
        this.do_kill(me);
    }
}
