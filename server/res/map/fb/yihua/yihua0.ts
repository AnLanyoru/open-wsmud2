import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '花径';
    desc = '花径纵横交错，浓郁花香中暗藏瘴毒，锋利枝叶擦过衣衫，令人气血翻涌。';
    exits = {
        south: 'fb/yihua/yihua1',
        north: 'fb/yihua/shandao',
    };

    on_enter(me) {
        if (!me.is_player) return;
        const damage = Math.max(1, Math.floor(me.max_hp / 20));
        me.add_hp(-damage);
        me.notify('花径中的毒香侵入肺腑，你损失了少许气血。');
    }
}
