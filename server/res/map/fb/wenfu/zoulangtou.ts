import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '走廊尽头';
    desc = "两侧回廊在此汇合，墙边竖着一根可供借力的<cmd cmd='look stake'>木桩</cmd>，墙后露出小楼飞檐。";
    exits = {
        southwest: 'fb/wenfu/zoulang2',
        north: 'fb/wenfu/tingzi',
        southeast: 'fb/wenfu/zoulang3',
    };

    constructor() {
        super();
        this.set_item('stake', '木桩', '木桩顶端磨得光滑，踩上去正可越过院墙。', [['jump', '踏桩跃墙', this.jump_stake]]);
    }

    jump_stake(me: USER) {
        const room = this.query('fb/wenfu/tingzi');
        if (room) me.moveto(room, undefined, '$N踏上木桩腾身而起，轻巧地越过院墙。');
    }
}
