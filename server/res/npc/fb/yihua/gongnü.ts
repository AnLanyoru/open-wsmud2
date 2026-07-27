import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '移花宫女';
    desc = '宫女手执短剑分守长廊，神色冷漠，绝不容外人踏入宫禁半步。';
    gender = 2;
    age = 20;
    hp = 52000;
    max_hp = 52000;
    mp = 16000;
    max_mp = 16000;
    score = 5;

    constructor() {
        super();
        this.skill_map(['force', 780], ['dodge', 800], ['parry', 780], ['sword', 800]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
