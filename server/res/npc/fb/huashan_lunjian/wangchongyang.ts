import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '王重阳';
    desc = '道人身形高古，背负长剑立于台心，目光扫过四峰，周身剑意与天地浑然相合。';
    title = '<mag>中神通</mag>';
    gender = 1;
    age = 68;
    hp = 360000;
    max_hp = 360000;
    mp = 120000;
    max_mp = 120000;
    score = 20;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1400], ['dodge', 1400], ['parry', 1400], ['sword', 1400], ['unarmed', 1350], ['quanzhenjianfa', 1450, ['sword', 'parry']], ['jinyangong', 1400, 'dodge'], ['xiantiangong', 1450, 'force']);
    }
}
