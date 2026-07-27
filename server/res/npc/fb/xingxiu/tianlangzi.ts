import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '天狼子';
    desc = '一个目光凶狠的星宿弟子守在浅滩边，腰间皮囊不断散发出刺鼻药味。';
    gender = 1;
    age = 32;
    hp = 36000;
    max_hp = 36000;
    mp = 10000;
    max_mp = 10000;

    constructor() {
        super();
        this.skill_map(['force', 660], ['dodge', 660], ['parry', 660], ['blade', 660]);
    }
}
