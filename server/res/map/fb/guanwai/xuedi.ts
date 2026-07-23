import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '雪地';
    desc = '白茫茫的雪地一直延伸到远处，凛冽的北风卷起雪粉，四面的景色看起来一模一样。';
    exits = {
        north: 'fb/guanwai/xuedi',
        south: 'fb/guanwai/xuedi',
        east: 'fb/guanwai/xuedi',
        west: 'fb/guanwai/xuedi',
    };

    on_enter(me: USER) {
        me.notify('风雪很快掩去了来路，你在白茫茫的雪地中迷失了方向。');
    }

    on_leave(me: USER, dir: string) {
        const owner = this.owner;
        if (!owner) return;
        const key = 'fb/guanwai/xuedi';
        const last = me.query_temp(key + '/dir');
        let count = 1;
        if (last == dir) count = me.add_temp(key + '/count', 1) as number;
        else me.set_temp(key + '/count', count);
        me.set_temp(key + '/dir', dir);
        if (count < 5 || (dir != 'north' && dir != 'south' && dir != 'east')) return;
        const path = dir == 'east' ? 'fb/guanwai/huangdi' : 'fb/guanwai/chuanchang';
        const room = this.parent?.rooms?.find(item => item.path == path)?.query_copy(owner);
        if (!room) return;
        me.remove_temp(key + '/dir');
        me.remove_temp(key + '/count');
        me.moveto(room, '$N终于辨清方向，快步走出了雪地。', '$N顶着风雪走了过来。');
        return false;
    }
}
