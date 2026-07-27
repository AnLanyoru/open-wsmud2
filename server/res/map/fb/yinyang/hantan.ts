import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '碧水寒潭';
    desc = "寒潭幽碧不见底，水面不断升起刺骨白雾，<cmd cmd='look deep_water'>潭底深水</cmd>中隐约闪过一团幽蓝冷光。";
    exits = {
        northeast: 'fb/yinyang/yandi',
        east: 'fb/yinyang/yougu',
    };

    constructor() {
        super();
        this.set_item('deep_water', '深水', '潭水越往下越寒，若无重物压身绝难潜到最深处。', [
            ['dive', '抱石下潜', this.dive],
        ]);
    }

    dive(me: USER) {
        if (!this.fb_query_temp('yinyang_boulder', me, false))
            return me.notify('寒潭浮力极强，你才潜下数尺便被推回水面。');
        this.fb_set_temp('yinyang_dived', true, me);
        const room = this.query('fb/yinyang/yougu');
        if (room) me.moveto(room, undefined, '$N抱着巨石沉入寒潭，循水下暗流进入幽谷。');
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'east' && !this.fb_query_temp('yinyang_dived', me, false)) {
            return me.notify_fail('幽谷藏在寒潭水下，须抱着重物潜入深水才能抵达。');
        }
    }
}
