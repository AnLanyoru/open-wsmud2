import type { USER } from '../../../../core/char/user.js';
import type { CORPSE } from '../../../../core/item/corpse.js';
import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '李秋水';
    desc = '白衣女子蒙着面纱站在山径中央，声音柔媚，掌风却凌厉得割面生疼。';
    gender = 2;
    age = 67;
    hp = 270000;
    max_hp = 270000;
    mp = 92000;
    max_mp = 92000;
    score = 50;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1320], ['dodge', 1340], ['parry', 1300], ['unarmed', 1340]);
    }

    on_enter(me) {
        if (!me.is_player || this.fight_type) return;
        if (this.environment?.fb_query_temp('diff', me, 0) === 1 && !this.environment.fb_query_temp('piaomiao_carrying', me, false)) {
            me.notify('困难模式必须先背起天山童姥，再在背负状态下挑战李秋水。');
            return;
        }
        this.do_kill(me);
    }

    on_died(me: USER | undefined, _corpse: CORPSE) {
        if (!me || !this.die_room) return;
        this.die_room.fb_set_temp('piaomiao_saved', true, me);
        me.notify(this.die_room.fb_query_temp('diff', me, 0) === 1 ? '你背着童姥击败李秋水，通往闭关室的道路已经打开。' : '李秋水败退后，天山童姥现身，请你背起她送往闭关室。');
    }
}
