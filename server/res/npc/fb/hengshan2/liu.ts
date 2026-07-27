import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '刘正风';
    desc = '刘正风衣襟染血，仍以长剑苦苦抵挡费斌的凌厉攻势。';
    title = '衡山派名宿';
    gender = 1;
    age = 48;
    hp = 18000;
    max_hp = 18000;
    mp = 5000;
    max_mp = 5000;
    no_fight = true;

    constructor() {
        super();
        this.skill_map(
            ['force', 480],
            ['dodge', 480],
            ['parry', 480],
            ['sword', 480],
            ['hengshanwushenjian', 480, ['sword', 'parry']],
        );
    }
}
