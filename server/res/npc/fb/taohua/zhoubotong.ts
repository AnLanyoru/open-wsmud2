import type { CORPSE } from '../../../../core/item/corpse.js';
import type { USER } from '../../../../core/char/user.js';
import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '周伯通';
    desc = '一个须发花白的老者抱着石匣上蹿下跳，神情顽皮，拳掌间却蕴着深厚内力。';
    gender = 1;
    age = 65;
    hp = 42000;
    max_hp = 42000;
    mp = 14000;
    max_mp = 14000;
    score = 40;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 700], ['dodge', 700], ['parry', 700], ['unarmed', 700]);
    }

    on_died(me: USER | undefined, _corpse: CORPSE) {
        if (!me || !this.die_room) return;
        this.die_room.fb_set_temp('taohua_box', true, me);
        me.notify('周伯通落败后哈哈大笑，将怀里的石匣丢给了你。');
    }
}
