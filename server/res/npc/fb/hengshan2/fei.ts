import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '费斌';
    desc = '费斌剑势沉雄狠辣，招招紧逼刘正风，脸上满是森然杀意。';
    title = '<hic>嵩山十三太保</hic>';
    gender = 1;
    age = 44;
    hp = 22000;
    max_hp = 22000;
    mp = 6500;
    max_mp = 6500;
    score = 70;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(
            ['force', 520],
            ['dodge', 520],
            ['parry', 520],
            ['sword', 520],
            ['songshanjianfa', 520, ['sword', 'parry']],
        );
    }
}
