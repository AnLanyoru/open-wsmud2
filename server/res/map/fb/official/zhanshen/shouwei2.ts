import { ROOM } from '../../../../../core/room/room.js';
import { NPC } from '../../../../../core/char/npc.js';
import type { USER } from '../../../../../core/char/user.js';

export default class extends ROOM {
    name = '守卫后殿';
    desc = '后殿地面遍布断戟残甲，第二波神殿守卫列阵于祭坛前，五道强横气机将大殿入口牢牢锁住。';
    exits = {
        west: 'fb/official/zhanshen/shouwei1',
        east: 'fb/official/zhanshen/dadian',
    };

    on_enter(me: USER) {
        if (!me.is_player || this.fb_query_temp('zhanshen_guard_wave', me, 0) !== 2 || this.is_here('fb/zhanshen/shouwei')) return;
        for (let i = 0; i < 5; i++) {
            const guard = NPC.CLONE('fb/zhanshen/shouwei');
            guard.set_temp('zhanshen_wave', 2);
            this.item_changed(guard, true);
            guard.do_kill(me);
        }
        me.notify('<hir>第二波五名神殿守卫从祭坛后同时杀出！</hir>');
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'east' && this.fb_query_temp('zhanshen_guard_wave', me, 0) < 3) {
            return me.notify_fail('第二波神殿守卫结成战阵，寸步不让。');
        }
    }
}
