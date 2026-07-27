import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '石窟';
    desc = "天然石窟幽深清冷，岩壁上密布历代斋主留下的<cmd cmd='look sword_marks'>剑痕</cmd>，此处是各路线最终领悟之地。";
    exits = {
        north: 'fb/cihang/chayuan',
    };

    constructor() {
        super();
        this.set_item('sword_marks', '剑痕', '击败庞斑并返回帝塔峰，经桃源小径进入石窟后，可在此完成领悟。', [['realize', '领悟剑典', this.realize]]);
    }

    realize(me: USER) {
        if (!this.fb_query_temp('cihang_pangban', me, false)) return me.notify('庞斑尚未败亡，剑意始终散乱难明。');
        if (this.fb_query_temp('cihang_realized', me, false)) return me.notify('你已经完成这次慈航静斋路线。');
        this.fb_set_temp('cihang_realized', true, me);
        me.add_fbscore(20, 100);
        me.notify('你静观剑痕，终于悟得慈航剑典真意，完成所选称号路线。');
    }
}
