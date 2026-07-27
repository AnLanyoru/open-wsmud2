import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '杨莲亭';
    title = '<him>日月神教总管</him>';
    desc = '日月神教总管拦在承德殿中，神情骄横，身后教众却对他毕恭毕敬。';
    gender = 1;
    age = 35;
    hp = 150000;
    max_hp = 150000;
    mp = 46000;
    max_mp = 46000;
    score = 15;

    constructor() {
        super();
        this.skill_map(['force', 1080], ['dodge', 1060], ['parry', 1060], ['sword', 1080]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
