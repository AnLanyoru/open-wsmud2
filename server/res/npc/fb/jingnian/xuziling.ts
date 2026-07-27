import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '徐子陵';
    desc = '青年神色淡泊宁静，体内长生真气循环不息，似与铜殿融为一体。';
    title = '<hiy>扬州双龙</hiy>';
    gender = 1;
    age = 28;
    hp = 520000;
    max_hp = 520000;
    mp = 180000;
    max_mp = 180000;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['force', 1650], ['dodge', 1600], ['parry', 1650], ['unarmed', 1650], ['changshengjue', 1720, ['force', 'dodge']], ['rulaishenzhang', 1700, ['unarmed', 'parry']]);
    }

    on_enter(me) {
        if (me.is_player && this.environment?.fb_query_temp('jingnian_route', me, '') === 'sengwang' && !this.fight_type) this.do_kill(me);
    }

    on_died(killer) {
        if (!killer || !this.die_room || this.die_room.fb_query_temp('jingnian_route', killer, '') !== 'sengwang') return;
        this.die_room.fb_set_temp('jingnian_hebi', true, killer);
        if (!this.die_room.fb_query_temp('jingnian_xuziling_score', killer, false)) {
            this.die_room.fb_set_temp('jingnian_xuziling_score', true, killer);
            killer.add_fbscore(50, 100);
        }
        killer.notify('徐子陵败退，僧王线的和氏璧落入你手中。');
    }
}
