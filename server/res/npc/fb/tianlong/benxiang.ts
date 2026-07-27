import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '本相';
    desc = '本相和尚盘坐无净阁前，听见脚步便起身拦住去路。';
    hp = 155000;
    max_hp = 155000;
    mp = 54000;
    max_mp = 54000;
    score = 15;

    constructor() {
        super();
        this.skill_map(['force', 1120], ['dodge', 1100], ['parry', 1120], ['unarmed', 1120]);
    }
}
