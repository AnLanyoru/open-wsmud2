import type { USER } from '../../../core/char/user.js';
import type Heilong from '../../npc/bj/lm/heilong.js';
import { ROOM } from '../../../core/room/room.js';
import { queryLongmaiRoom, queryLongmaiState } from './shimen.js';

export default class extends ROOM {
    name = '镇锁台';
    desc =
        "石台上的铜锁各缠异纹，一引地脉，一含兵煞，一藏龙吟，锁脉尽头皆没入北面的石门。可<cmd cmd='look sansuo'>查看铜锁(sansuo)</cmd>。";
    exits = { south: 'longmai/huiyinlang', north: 'longmai/suolongjing' };

    constructor() {
        super();
        this.set_item('dimai', '地脉锁', '锁孔环绕相生纹，似乎与五行殿中的地气有着关联。', [['unlock', '解除', this.unlockLock]]);
        this.set_item('binghun', '兵魂锁', '锁芯兵煞森然，气息遥遥牵向来路上的守卫阵眼。', [
            ['unlock', '解除', this.unlockLock],
        ]);
        this.set_item('longyin', '龙吟锁', '锁簧内声纹盘绕，似乎与回音廊中的余响有着关联。', [
            ['unlock', '解除', this.unlockLock],
        ]);
        this.set_item('sansuo', '铜锁', '诸锁各承一缕禁制气息，彼此独立，却又一同牵系着北面的石门。', [
            ['check', '查看', this.check],
        ]);
    }

    unlockLock(me: USER, id: string) {
        if (id === 'dimai') return this.unlockDimai(me);
        if (id === 'binghun') return this.unlockBinghun(me);
        if (id === 'longyin') return this.unlockLongyin(me);
    }

    unlockDimai(me: USER) {
        const state = queryLongmaiState(me);
        if (!state?.query_temp('lm_wuxing_done', 0)) return me.notify('地脉锁纹丝不动。你隐约感觉五行殿中的地气尚未流转至此。');
        this.unlock(me, 1, '地脉锁');
    }

    unlockBinghun(me: USER) {
        const entrance = queryLongmaiRoom('longmai/shimen', me);
        const passage = queryLongmaiRoom('longmai/yongdao', me);
        if (entrance?.find_by_path('bj/lm/xiezi') || passage?.find_by_path('bj/lm/yongwei')) {
            return me.notify('兵魂锁煞气翻涌。你隐约感觉来路上的守卫阵眼仍在与锁芯彼此呼应。');
        }
        this.unlock(me, 2, '兵魂锁');
    }

    unlockLongyin(me: USER) {
        const state = queryLongmaiState(me);
        if (!state?.query_temp('lm_echo_done', 0)) return me.notify('龙吟锁中余响纷乱。你隐约感觉回音廊中的声纹尚未寻得归处。');
        this.unlock(me, 4, '龙吟锁');
    }

    unlock(me: USER, bit: number, name: string) {
        const state = queryLongmaiState(me);
        if (!state) return me.notify('铜锁没有反应。');
        const locks = state.query_temp('lm_locks', 0);
        if (locks & bit) return me.notify(name + '已经解除。');
        const next = locks | bit;
        state.set_temp('lm_locks', next);
        me.send_room('$N转动' + name + '，锁舌应声弹开。');
        if (next !== 7) return me.notify('你隐约感觉仍有别处传来的禁制气息牵系着石门。');
        this.release(me, state, bit);
    }

    release(me: USER, state: ROOM, lastBit: number) {
        if (state.query_temp('lm_released', 0)) return me.notify('你隐约感觉石台上的锁脉气息已经尽数消散。');
        state.set_temp('lm_released', 1);
        const well = queryLongmaiRoom('longmai/suolongjing', me);
        const dragon = well?.find_by_path('bj/lm/heilong') as Heilong | undefined;
        if (!well || !dragon) {
            state.set_temp('lm_released', 0);
            return me.notify('锁龙井中的封印没有响应。');
        }
        const moved = me.moveto(well, '$N踏入锁龙井。', '$N从镇锁台走了进来。', 'north');
        if (moved === false || me.environment !== well) {
            state.set_temp('lm_locks', state.query_temp('lm_locks', 0) & ~lastBit);
            state.set_temp('lm_released', 0);
            return me.notify('石门刚刚松动便再度闭合，最后一道铜锁也退回原位，可以重新尝试。');
        }
        me.send_room('三道铜锁同时崩开，通往锁龙井的石门轰然下沉。');
        dragon.on_free(me);
    }

    check(me: USER) {
        const locks = queryLongmaiState(me)?.query_temp('lm_locks', 0) || 0;
        me.notify('地脉锁' + (locks & 1 ? '锁舌已松，纹路归于黯淡。' : '纹路仍随地气微微明灭。'));
        me.notify('兵魂锁' + (locks & 2 ? '煞气已散，锁芯悄然停转。' : '锁芯仍传出若有若无的兵戈之声。'));
        me.notify('龙吟锁' + (locks & 4 ? '余音已歇，锁簧不再震颤。' : '锁簧之中仍有杂乱余音盘旋。'));
    }

    countLocks(locks: number) {
        return (locks & 1 ? 1 : 0) + (locks & 2 ? 1 : 0) + (locks & 4 ? 1 : 0);
    }

    on_leave(me: USER, dir: string) {
        const locks: number = queryLongmaiState(me)?.query_temp('lm_locks', 0) || 0;
        if (dir === 'north' && locks !== 7) {
            return me.notify_fail('北面的石门沉重如山。你隐约感觉仍有未散的锁脉气息将其牢牢牵住。');
        }
    }
}
