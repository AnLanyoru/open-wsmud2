import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '铜殿禅师';
    desc = '老僧盘坐铜殿之内，僧袍无风自动，浑厚禅功牢牢护住中央的和氏璧。';
    title = '<hic>净念禅宗护法</hic>';
    gender = 1;
    age = 68;
    hp = 300000;
    max_hp = 300000;
    mp = 110000;
    max_mp = 110000;

    constructor() {
        super();
        this.skill_map(['force', 1450], ['dodge', 1400], ['parry', 1450], ['staff', 1480], ['wunianchangong', 1500, 'force'], ['fumozhang', 1500, ['staff', 'parry']]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
