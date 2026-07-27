import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '阿紫';
    desc = '紫衣少女在水边把玩一枚细针，笑容天真烂漫，眼神却叫人不寒而栗。';
    gender = 2;
    age = 17;
    hp = 34000;
    max_hp = 34000;
    mp = 10000;
    max_mp = 10000;

    constructor() {
        super();
        this.skill_map(['force', 650], ['dodge', 700], ['parry', 650], ['throwing', 700]);
    }
}
