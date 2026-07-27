import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '寇仲';
    desc = '青年目光锐利，举止豪迈，体内长生真气生生不息，正警惕地守着崖底。';
    title = '<hiy>少帅</hiy>';
    gender = 1;
    age = 28;
    hp = 560000;
    max_hp = 560000;
    mp = 190000;
    max_mp = 190000;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1680], ['dodge', 1650], ['parry', 1680], ['blade', 1700], ['changshengjue', 1750, ['force', 'dodge']]);
    }

    on_enter(me) {
        if (me.is_player && this.environment?.fb_query_temp('jingnian_route', me, '') === 'shaoshuai' && !this.fight_type) this.do_kill(me);
    }

    on_died(killer) {
        if (!killer || !this.die_room || this.die_room.fb_query_temp('jingnian_route', killer, '') !== 'shaoshuai') return;
        this.die_room.fb_set_temp('jingnian_disguised', true, killer);
        killer.notify('你击败寇仲，并依照少帅线所需完成伪装。');
    }
}
