import { NPC } from '../../../../core/char/npc.js';

export default class extends NPC {
    name = '狮吼子';
    desc = '魁梧汉子横在水道中央，嗓音如雷，手中钢刀将通往日月洞的道路牢牢封住。';
    gender = 1;
    age = 36;
    hp = 45000;
    max_hp = 45000;
    mp = 13000;
    max_mp = 13000;
    score = 30;

    constructor() {
        super();
        this.skill_map(['force', 720], ['dodge', 720], ['parry', 720], ['blade', 720]);
    }

    on_enter(me) {
        if (!me.is_player || this.fight_type) return;
        me.notify('狮吼子大喝道：星宿海岂容外人乱闯！');
        this.do_kill(me);
    }
}
