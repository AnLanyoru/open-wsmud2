import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '王夫人';
    desc = '锦衣贵妇冷冷守着云锦楼，目光扫过来客，手中长剑已悄然出鞘。';
    gender = 2;
    age = 40;
    hp = 98000;
    max_hp = 98000;
    mp = 32000;
    max_mp = 32000;
    score = 15;

    constructor() {
        super();
        this.skill_map(['force', 920], ['dodge', 920], ['parry', 920], ['sword', 940]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
