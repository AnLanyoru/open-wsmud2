import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '玉磬子';
    desc = '玉磬子守在升仙坊前，长剑斜指山道，气息凝重如磐石。';
    gender = 1;
    age = 61;
    hp = 20000;
    max_hp = 20000;
    mp = 5800;
    max_mp = 5800;
    score = 30;

    constructor() {
        super();
        this.skill_map(['force', 530], ['dodge', 530], ['parry', 530], ['sword', 530], ['taishanjianfa', 530, ['sword', 'parry']]);
    }
}
