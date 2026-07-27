import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '血刀弟子';
    title = '<hic>血刀门徒</hic>';
    desc = '一名血刀弟子挥舞猩红弯刀，满脸凶戾地堵住山路。';
    hp = 180000;
    max_hp = 180000;
    mp = 60000;
    max_mp = 60000;
    score = 15;

    constructor() {
        super();
        this.skill_map(['force', 1180], ['dodge', 1180], ['parry', 1180], ['blade', 1200]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
