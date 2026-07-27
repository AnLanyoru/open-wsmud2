import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '恒山师太';
    desc = '恒山派师太手持长剑，神情肃穆，对来犯者毫不退让。';
    gender = 2;
    age = 52;
    hp = 18000;
    max_hp = 18000;
    mp = 8500;
    max_mp = 8500;
    score = 0;

    constructor() {
        super();
        this.skill_map(['dodge', 520], ['parry', 540], ['force', 520], ['sword', 560], ['unarmed', 520], ['hengshanjianfa', 580, ['sword', 'parry']], ['tianchangzhang', 540, 'unarmed']);
    }

    on_enter(me) {
        this.do_kill(me);
    }
}
