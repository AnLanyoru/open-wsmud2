import { ROOM } from '../../../../../core/room/room.js';
import { NPC } from '../../../../../core/char/npc.js';
import type { USER } from '../../../../../core/char/user.js';

export default class extends ROOM {
    name = '守卫前殿';
    desc = '前殿石柱刻着千军征伐图，第一波披甲神殿守卫从阴影中踏出，长戈交错封住东方道路。';
    exits = {
        southwest: 'fb/official/zhanshen/shenshi',
        east: 'fb/official/zhanshen/shouwei2',
    };
    on_enter(me: USER) {
        if (!me.is_player || this.fb_query_temp('zhanshen_guard_wave', me, 0) !== 1 || this.is_here('fb/zhanshen/shouwei')) return;
        const limit = this.fb_query_temp('diff', me, 0) === 1 ? 60 : 360;
        this.fb_set_temp('zhanshen_guard_started', Date.now(), me);
        this.fb_set_temp('zhanshen_guard_limit', limit, me);
        this.spawn(me, 5, 1);
        me.notify('<hir>第一波五名神殿守卫现身，三波守卫必须在' + limit + '秒内全部击败！</hir>');
    }

    spawn(me: USER, count: number, wave: number) {
        for (let i = 0; i < count; i++) {
            const guard = NPC.CLONE('fb/zhanshen/shouwei');
            guard.set_temp('zhanshen_wave', wave);
            this.item_changed(guard, true);
            guard.do_kill(me);
        }
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'east' && this.fb_query_temp('zhanshen_guard_wave', me, 0) < 2) {
            me.notify('第一波神殿守卫尚未尽数伏诛。');
            return false;
        }
    }
}
