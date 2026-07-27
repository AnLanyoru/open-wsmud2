import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '花径';
    desc = '夹道奇花高过人肩，枝蔓如网般封住天空，每向前一步都被毒香与花刺侵袭。';
    exits = {
        north: 'fb/yihua/yihua0',
        south: 'fb/yihua/damen',
    };

    on_enter(me) {
        if (!me.is_player) return;
        const damage = Math.max(1, Math.floor(me.max_hp / 20));
        me.add_hp(-damage);
        me.notify('花刺划破衣袖，馥郁毒香使你的气血一阵翻腾。');
    }
}
