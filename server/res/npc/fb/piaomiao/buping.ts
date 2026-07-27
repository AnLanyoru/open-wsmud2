import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '不平道人';
    desc = '道人握着一柄松纹古剑，面色阴沉，与乌老大一同封住上山道路。';
    gender = 1;
    age = 53;
    hp = 155000;
    max_hp = 155000;
    mp = 49000;
    max_mp = 49000;
    score = 15;

    constructor() {
        super();
        this.skill_map(['force', 1100], ['dodge', 1100], ['parry', 1120], ['sword', 1120]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
