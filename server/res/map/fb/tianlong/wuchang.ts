import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '无常阁';
    desc = '无常阁中经幡低垂，本参和尚双指并拢，森然剑气锁住东行道路。';
    exits = {
        north: 'fb/tianlong/wuwo',
        east: 'fb/tianlong/banruo',
    };

    constructor() {
        super();
        this.set_npc('fb/tianlong/bencan');
    }

    on_set_difficulty = (type: number) => {
        this.set_temp('tianlong_hard', type === 1);
        const monk = this.find_by_path('fb/tianlong/bencan');
        if (type === 1 && monk?.check_npc()) monk.score = 0;
    };

    on_leave(me: USER, dir: string) {
        if (dir !== 'east') return;
        if (this.query_temp('tianlong_hard')) {
            if (!this.find_by_path('fb/tianlong/bencan'))
                return me.notify_fail('你已惊动护殿高僧，无法再伪装混入牟尼堂。');
            if (hasDisguise(me)) return;
            return me.notify_fail('本参和尚看破你的身份；困难模式必须戴上阿朱的易容面具混入寺内。');
        }
        if (!this.find_by_path('fb/tianlong/bencan')) return;
        return me.notify_fail('本参和尚剑气封路，你必须击败他才能继续前行。');
    }
}

function hasDisguise(me: USER) {
    return me.equipment.some(item => item?.path === 'eq/lv4/azhudeyirongmianju');
}
