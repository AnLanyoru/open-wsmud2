import type { USER } from '../../../../core/char/user.js';
import type { CORPSE } from '../../../../core/item/corpse.js';
import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '童百熊';
    title = '<hio>日月神教风雷堂长老</hio>';
    desc = '风雷堂长老身形魁梧，须发虬张，举手间隐有风雷之声。';
    gender = 1;
    age = 58;
    hp = 145000;
    max_hp = 145000;
    mp = 45000;
    max_mp = 45000;
    score = 15;

    constructor() {
        super();
        this.skill_map(['force', 1060], ['dodge', 1040], ['parry', 1060], ['unarmed', 1080]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }

    on_died(me: USER | undefined, _corpse: CORPSE) {
        if (!me || !this.die_room) return;
        this.die_room.fb_set_temp('heimu_fenglei', true, me);
        me.notify('你从童百熊身上取下了风雷堂令牌。');
    }
}
