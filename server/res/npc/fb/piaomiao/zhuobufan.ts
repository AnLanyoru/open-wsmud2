import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '卓不凡';
    desc = '一字慧剑门高手卓不凡横剑立在涧边，剑尖吞吐着数寸青芒。';
    title = '<hic>剑神</hic>';
    gender = 1;
    age = 45;
    hp = 175000;
    max_hp = 175000;
    mp = 56000;
    max_mp = 56000;
    score = 20;

    constructor() {
        super();
        this.skill_map(['force', 1160], ['dodge', 1140], ['parry', 1180], ['sword', 1200]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
