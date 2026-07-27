import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '张翠山';
    title = '<hiw>武当五侠</hiw>';
    desc = '青袍男子仗剑守在谢逊身侧，神色温厚坚定，显然不会让来客伤害义兄。';
    gender = 1;
    age = 32;
    hp = 62000;
    max_hp = 62000;
    mp = 19000;
    max_mp = 19000;

    constructor() {
        super();
        this.skill_map(['force', 800], ['dodge', 800], ['parry', 800], ['sword', 800]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
