import { MONSTER } from '../../../../core/char/monster.js';

export default class extends MONSTER {
    name = '火龙';
    desc = '一头赤鳞火龙盘踞在古泽间，吐息带着灼人的热浪。';
    hp = 26000;
    max_hp = 26000;
    mp = 8000;
    max_mp = 8000;
    score = 15;

    constructor() {
        super();
        this.skill_map(['bite', 620], ['bite2', 620, 'bite'], ['huolong', 620]);
        this.set_drop({ obj: 'res/huolongpi', min: 1, max: 2 });
    }

    on_enter(me) {
        me.notify('火龙昂首嘶吼，卷起热浪向你扑来！');
        this.do_kill(me);
    }
}
