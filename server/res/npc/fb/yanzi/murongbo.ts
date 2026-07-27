import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '慕容博';
    desc = '蒙面老者自水阁阴影中缓步走出，气息深沉如渊，掌风未发已令人窒息。';
    gender = 1;
    age = 65;
    hp = 190000;
    max_hp = 190000;
    mp = 65000;
    max_mp = 65000;
    score = 40;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1160], ['dodge', 1140], ['parry', 1180], ['unarmed', 1180]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
