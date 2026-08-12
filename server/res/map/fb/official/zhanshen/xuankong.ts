import { ROOM } from '../../../../../core/room/room.js';
import type { NPC } from '../../../../../core/char/npc.js';
import type { USER } from '../../../../../core/char/user.js';

export default class extends ROOM {
    name = '悬空神石';
    desc = '巨大神石悬在雷云之上，兵主蚩尤手执凶兵立于中央，八方煞气汇聚成远古战场的血色幻影。';
    exits = {
        south: 'fb/official/zhanshen/shijie',
        north: 'fb/official/zhanshen/jiuchongtian',
    };

    constructor() {
        super();
        this.set_npc('fb/zhanshen/chiyou');
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'north' && this.is_here('fb/zhanshen/chiyou')) return me.notify_fail('蚩尤以凶兵封住登天之路。');
    }

    on_enter(me: USER) {
        if (!me.is_player || this.fb_query_temp('diff', me, 0) !== 1 || this.query_temp('hard_initialized', false)) return;
        this.set_temp('hard_initialized', true);
        const chiyou = this.find_by_path('fb/zhanshen/chiyou') as NPC | undefined;
        if (!chiyou) return;
        chiyou.name = '兵主蚩尤';
        chiyou.max_hp *= 2;
        chiyou.hp = chiyou.max_hp;
        chiyou.max_mp *= 2;
        chiyou.mp = chiyou.max_mp;
    }
}
