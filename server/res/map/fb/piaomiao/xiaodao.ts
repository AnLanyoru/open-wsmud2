import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '小路';
    desc = '花园后的石径盘旋向上，云雾遮住远峰，李秋水白衣飘飞，拦在闭关室前。';
    exits = {
        north: 'fb/piaomiao/biguan',
        south: 'fb/piaomiao/huayuan',
    };
    difficulty = 0;

    constructor() {
        super();
        this.set_npc('fb/piaomiao/liqiushui');
        this.set_item('tonglao', '天山童姥', '童姥身负重伤，可将她背起送往闭关室。', [['carry', '背起童姥', this.carry]]);
    }

    on_set_difficulty = (type: number) => {
        this.difficulty = type;
    };

    carry(me: USER) {
        if (this.fb_query_temp('piaomiao_carrying', me, false)) return me.notify('你已经背着天山童姥。');
        if (this.difficulty === 0 && !this.fb_query_temp('piaomiao_saved', me, false)) return me.notify('李秋水仍在一旁虎视眈眈，此刻无法背起童姥。');
        this.fb_set_temp('piaomiao_carrying', true, me);
        me.notify(this.difficulty === 1 ? '你在李秋水面前背起童姥，必须在背负状态下击败她。' : '你背起获救的天山童姥，向闭关室赶去。');
    }

    on_leave(me: USER, dir: string) {
        if (dir !== 'north') return;
        if (this.is_here('fb/piaomiao/liqiushui')) return me.notify_fail('李秋水封住了通往闭关室的道路。');
        if (!this.fb_query_temp('piaomiao_carrying', me, false)) return me.notify_fail('你必须背起天山童姥再前往闭关室。');
    }
}
