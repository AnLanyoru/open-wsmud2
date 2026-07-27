import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '慕容侍女';
    desc = '一名秀丽女子安静地守在屋中，似乎不愿卷入燕子坞的江湖纷争。';
    gender = 2;
    age = 20;
    hp = 70000;
    max_hp = 70000;
    mp = 22000;
    max_mp = 22000;
    no_fight = true;

    constructor() {
        super();
        this.skill_map(['force', 800], ['dodge', 820], ['parry', 800], ['unarmed', 800]);
    }

    on_kill() {
        return false;
    }
}
