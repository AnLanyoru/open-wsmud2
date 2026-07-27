import { ROOM } from '../../../../../core/room/room.js';
import type { NPC } from '../../../../../core/char/npc.js';
import type { USER } from '../../../../../core/char/user.js';

export default class extends ROOM {
    name = '刀皇殿';
    desc = '殿中万柄石刀向中央俯首，刀皇独坐玄铁王座，膝上一柄古刀尚未出鞘，锋芒已令肌肤刺痛。';
    exits = {
        west: 'fb/official/zhanshen/dadian',
    };

    constructor() {
        super();
        this.set_npc('fb/zhanshen/daohuang');
    }

    on_enter(me: USER) {
        if (!me.is_player) return;
        if (!this.fb_query_temp('zhanshen_worshipped', me, false)) {
            me.notify('你未曾祭拜战神，刀皇并未真正现身。');
            return;
        }
        const daohuang = this.find_by_path('fb/zhanshen/daohuang') as NPC | undefined;
        if (daohuang && !daohuang.fight_type) daohuang.do_kill(me);
    }

    on_set_difficulty = (type: number) => {
        if (type !== 1) return;
        const daohuang = this.find_by_path('fb/zhanshen/daohuang') as NPC | undefined;
        if (!daohuang) return;
        daohuang.title = '<hio>万刀之皇</hio>';
    };

    on_leave(me: USER, dir: string) {
        if (dir === 'west' && this.is_here('fb/zhanshen/daohuang')) return me.notify_fail('刀皇的无形刀意封住退路。');
    }
}
