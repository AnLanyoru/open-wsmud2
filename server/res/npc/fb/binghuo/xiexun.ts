import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '谢逊';
    desc = '满头金发的魁梧汉子盘坐石洞深处，双目虽盲，周身气势却如怒海狂涛。';
    title = '金毛狮王';
    gender = 1;
    age = 48;
    hp = 76000;
    max_hp = 76000;
    mp = 24000;
    max_mp = 24000;
    score = 30;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 860], ['dodge', 820], ['parry', 860], ['unarmed', 860], ['blade', 860]);
    }

    on_enter(me) {
        if (!me.is_player || this.fight_type) return;
        me.notify('谢逊侧耳喝道：来者何人，报上名来！');
        this.do_kill(me);
    }
}
