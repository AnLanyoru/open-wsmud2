import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '崖底高手';
    desc = '一名来历不明的高手守在崖底乱石之间，气机紧锁通往铜殿的捷径。';
    title = '<hic>盗帅线守关人</hic>';
    gender = 1;
    age = 45;
    hp = 260000;
    max_hp = 260000;
    mp = 90000;
    max_mp = 90000;

    constructor() {
        super();
        this.skill_map(['force', 1350], ['dodge', 1350], ['parry', 1350], ['unarmed', 1380]);
    }

    on_enter(me) {
        if (me.is_player && this.environment?.fb_query_temp('jingnian_route', me, '') === 'daoshuai' && !this.fight_type) this.do_kill(me);
    }
}
