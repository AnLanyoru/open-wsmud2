import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '白衣少女';
    desc = '一名白衣少女守在药炉旁，腰间缠着软鞭，衣袖隐约散发出甜腻毒香。';
    gender = 2;
    age = 19;
    hp = 30000;
    max_hp = 30000;
    mp = 9000;
    max_mp = 9000;
    score = 10;

    constructor() {
        super();
        this.skill_map(['force', 620], ['dodge', 620], ['parry', 620], ['whip', 620]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
