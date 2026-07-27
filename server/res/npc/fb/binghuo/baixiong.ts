import { MONSTER } from '../../../../core/char/monster.js';

export default class extends MONSTER {
    name = '大白熊';
    desc = '雪白巨熊人立而起足有丈余高，宽厚熊掌带着呼啸寒风向闯入者猛拍过来。';
    hp = 40000;
    max_hp = 40000;
    mp = 6500;
    max_mp = 6500;
    score = 10;

    constructor() {
        super();
        this.skill_map(['unarmed', 720]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
