import type { CORPSE } from '../../../../core/item/corpse.js';
import type { USER } from '../../../../core/char/user.js';
import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '护寺僧';
    desc = '灰衣僧人手持齐眉铜棍，脚踏伏魔阵位，沉默地封锁着白石广场。';
    title = '<hic>净念禅宗武僧</hic>';
    gender = 1;
    age = 42;
    hp = 220000;
    max_hp = 220000;
    mp = 70000;
    max_mp = 70000;

    constructor() {
        super();
        this.skill_map(['force', 1250], ['dodge', 1200], ['parry', 1250], ['staff', 1280], ['unarmed', 1200], ['fumozhang', 1320, ['staff', 'parry']], ['wunianchangong', 1280, 'force']);
    }

    on_enter(me) {
        const route = this.environment?.fb_query_temp('jingnian_route', me, '');
        if (me.is_player && ['sengwang', 'shaoshuai', 'xiewang'].includes(route) && !this.fight_type) this.do_kill(me);
    }

    on_died(killer: USER | undefined, _corpse: CORPSE) {
        if (killer && this.die_room?.fb_query_temp('jingnian_route', killer, '') === 'sengwang') killer.add_fbscore(10, 100);
    }
}
