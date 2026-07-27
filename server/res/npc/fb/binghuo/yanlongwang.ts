import { MONSTER } from '../../../../core/char/monster.js';

export default class extends MONSTER {
    name = '炎龙王';
    desc = '一头披覆暗红鳞甲的庞然巨兽盘踞火山口，灼热吐息令四周空气不断扭曲。';
    hp = 60000;
    max_hp = 60000;
    mp = 12000;
    max_mp = 12000;
    score = 20;

    constructor() {
        super();
        this.skill_map(['bite', 820]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
