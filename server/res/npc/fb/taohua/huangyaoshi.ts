import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '黄药师';
    desc = '青袍怪客负手立于海风之中，玉箫斜插腰间，冷峻目光令人不敢逼视。';
    title = '<hiy>东邪</hiy>';
    gender = 1;
    age = 52;
    hp = 52000;
    max_hp = 52000;
    mp = 18000;
    max_mp = 18000;
    score = 100;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 760], ['dodge', 760], ['parry', 760], ['unarmed', 760], ['sword', 760]);
    }

    on_enter(me) {
        if (!me.is_player || this.fight_type) return;
        me.notify('黄药师冷声道：能破桃花阵，且看你能否接下老夫几招！');
        this.do_kill(me);
    }
}
