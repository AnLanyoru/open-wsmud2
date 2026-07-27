import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '石室';
    desc = "东侧石室刻着赵客缦胡缨，银鞍照白马，<cmd cmd='look carving'>剑痕石刻</cmd>纵横交错，仿佛有人正于壁间纵马出剑。";
    exits = {
        west: 'fb/xiake/hole',
    };

    constructor() {
        super();
        this.set_item('carving', '剑痕石刻', '诗句与剑痕彼此呼应，须依石破天当前所问凝神领悟。', [['study', '领悟石壁', this.study]]);
    }

    study(me: USER) {
        const layer = this.fb_query_temp('xiake_layer', me, 1);
        if (this.fb_query_temp('xiake_asked', me, 0) !== layer) return me.notify('石破天尚未提出这一层的诗句疑问。');
        this.fb_set_temp('xiake_studied', layer, me);
        me.notify(layer === 6 ? '你苦思良久，只觉头昏脑胀，什么也没看懂。' : '你依照诗句凝神领悟，察觉一门基本技能的进境有所增长。');
    }
}
