import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '乌老大';
    desc = '三十六洞洞主乌老大持刀拦路，神色焦躁，显然正图谋攻上灵鹫宫。';
    gender = 1;
    age = 46;
    hp = 150000;
    max_hp = 150000;
    mp = 47000;
    max_mp = 47000;
    score = 15;

    constructor() {
        super();
        this.skill_map(['force', 1080], ['dodge', 1080], ['parry', 1080], ['blade', 1100]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
