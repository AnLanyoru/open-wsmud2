import type { USER } from '../../../../core/char/user.js';
import type { CORPSE } from '../../../../core/item/corpse.js';
import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '上官云';
    title = '<hiw>日月神教白虎堂长老</hiw>';
    desc = '白虎堂长老披着雪白大氅，双掌蓄势，冷眼审视闯堂之人。';
    gender = 1;
    age = 51;
    hp = 135000;
    max_hp = 135000;
    mp = 42000;
    max_mp = 42000;
    score = 15;

    constructor() {
        super();
        this.skill_map(['force', 1040], ['dodge', 1020], ['parry', 1040], ['unarmed', 1060]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }

    on_died(me: USER | undefined, _corpse: CORPSE) {
        if (!me || !this.die_room) return;
        this.die_room.fb_set_temp('heimu_baihu', true, me);
        me.notify('你从上官云身上取下了白虎堂令牌。');
    }
}
