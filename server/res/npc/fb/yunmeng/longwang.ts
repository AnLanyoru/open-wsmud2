import { MONSTER } from '../../../../core/char/monster.js';

export default class extends MONSTER {
    name = '火龙王';
    desc = '火龙王身躯如山，暗红鳞片间喷涌烈焰，威势远胜寻常火龙。';
    hp = 50000;
    max_hp = 50000;
    mp = 15000;
    max_mp = 15000;
    pfm_rate = 1;

    constructor() {
        super();
        this.skill_map(['bite', 720], ['bite2', 720, 'bite'], ['huolong', 720]);
        this.set_drop({ obj: 'res/huolongpi', min: 2, max: 4 });
    }

    on_enter(me) {
        me.notify('火龙王睁开熔金般的双眼，怒吼着向你发起攻击！');
        this.do_kill(me);
    }
}
