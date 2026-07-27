import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '内厅';
    desc = '厅中长案摆满清茶素果，四壁灯火通明，三名罚恶守卫按刀而立，目光冷峻地审视每一个来客。';
    exits = {
        north: 'fb/xiake/shibi',
        southeast: 'fb/xiake/hole',
    };

    constructor() {
        super();
        this.set_npc(['fb/xiake/shouwei', 3]);
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'southeast' && this.is_here('fb/xiake/shouwei')) return me.notify_fail('罚恶守卫封住了通往岛主石门的道路。');
    }
}
