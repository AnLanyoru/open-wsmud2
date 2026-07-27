import { MONSTER } from '../../../../core/char/monster.js';

export default class extends MONSTER {
    name = '巨鳄';
    desc = '一条披着厚重鳞甲的巨鳄伏在泥水中，血盆大口散发腥臭。';
    hp = 19000;
    max_hp = 19000;
    mp = 1000;
    max_mp = 1000;
    score = 10;

    constructor() {
        super();
        this.skill_map(['bite', 560], ['bite2', 560, 'bite']);
        this.set_drop({ obj: 'res/eyupi', min: 1, max: 2 });
    }

    on_enter(me) {
        me.notify('泥水骤然炸开，一条巨鳄向你猛扑过来！');
        this.do_kill(me);
    }
}
