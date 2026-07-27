import { MONSTER } from '../../../../core/char/monster.js';

export default class extends MONSTER {
    name = '巨蟒';
    desc = '水桶粗细的巨蟒蜷伏在阴冷石洞中，鳞片摩擦岩壁发出令人牙酸的沙沙声。';
    hp = 48000;
    max_hp = 48000;
    mp = 7000;
    max_mp = 7000;
    score = 30;

    constructor() {
        super();
        this.skill_map(['bite', 720]);
    }

    on_enter(me) {
        if (me.is_player && !this.fight_type) this.do_kill(me);
    }
}
