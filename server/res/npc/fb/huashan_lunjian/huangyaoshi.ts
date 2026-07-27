import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '黄药师';
    desc = '青袍宗师面容清癯，手中玉箫轻转，举止疏狂而目光锐利。';
    title = '<hiy>东邪</hiy>';
    gender = 1;
    age = 58;
    hp = 280000;
    max_hp = 280000;
    mp = 90000;
    max_mp = 90000;
    score = 20;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1250], ['dodge', 1250], ['parry', 1250], ['unarmed', 1250], ['sword', 1250], ['tanzhishengong', 1300, ['unarmed', 'parry']], ['luoyingshenjian', 1300, 'sword'], ['biboshengong', 1280, 'force']);
    }
}
