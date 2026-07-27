import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '花月奴';
    desc = '一名白衣女子守在移花阁前，衣袂无风自动，掌心隐隐凝着寒气。';
    gender = 2;
    age = 24;
    hp = 82000;
    max_hp = 82000;
    mp = 26000;
    max_mp = 26000;
    score = 10;

    constructor() {
        super();
        this.skill_map(['force', 900], ['dodge', 880], ['parry', 880], ['unarmed', 900]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
