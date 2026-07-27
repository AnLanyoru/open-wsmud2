import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '丁春秋';
    desc = '银发老者摇着羽扇端坐洞中，脸上笑意和煦，周围空气却弥漫着无形剧毒。';
    title = '<hiy>星宿老仙</hiy>';
    gender = 1;
    age = 68;
    hp = 68000;
    max_hp = 68000;
    mp = 22000;
    max_mp = 22000;
    score = 70;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 820], ['dodge', 820], ['parry', 820], ['unarmed', 820]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
