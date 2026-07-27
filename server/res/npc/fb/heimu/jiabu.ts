import type { USER } from '../../../../core/char/user.js';
import type { CORPSE } from '../../../../core/item/corpse.js';
import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '贾布';
    title = '<hic>日月神教青龙堂长老</hic>';
    desc = '青龙堂长老横刀立在堂中，腰间青铜令牌随着步伐轻轻碰响。';
    gender = 1;
    age = 47;
    hp = 138000;
    max_hp = 138000;
    mp = 43000;
    max_mp = 43000;
    score = 15;

    constructor() {
        super();
        this.skill_map(['force', 1040], ['dodge', 1040], ['parry', 1040], ['blade', 1060]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }

    on_died(me: USER | undefined, _corpse: CORPSE) {
        if (!me || !this.die_room) return;
        this.die_room.fb_set_temp('heimu_qinglong', true, me);
        me.notify('你从贾布身上取下了青龙堂令牌。');
    }
}
