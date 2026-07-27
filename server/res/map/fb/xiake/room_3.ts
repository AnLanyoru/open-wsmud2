import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '石室';
    desc = "西侧石室地面布满深浅不一的足印，<cmd cmd='look carving'>身法石刻</cmd>上人物衣袂飘飞，似在演示神妙步法。";
    exits = {
        east: 'fb/xiake/hole',
    };

    constructor() {
        super();
        this.set_item('carving', '身法石刻', '诗句与足印彼此呼应，须依石破天当前所问凝神领悟。', [['study', '领悟石壁', this.study]]);
    }

    study(me: USER) {
        const layer = this.fb_query_temp('xiake_layer', me, 1);
        if (this.fb_query_temp('xiake_asked', me, 0) !== layer) return me.notify('石破天尚未提出这一层的诗句疑问。');
        this.fb_set_temp('xiake_studied', layer, me);
        me.notify(layer === 6 ? '你苦思良久，只觉头昏脑胀，什么也没看懂。' : '你依照诗句凝神领悟，察觉一门基本技能的进境有所增长。');
    }
}
