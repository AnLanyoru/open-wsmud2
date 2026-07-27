import type { USER } from '../../../../core/char/user.js';
import { NPC } from '../../../../core/char/npc.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '琴室';
    desc = "琴室中央放着一张<cmd cmd='look qin'>焦尾古琴</cmd>，七弦蒙尘，四周石壁使每一点声响都久久回荡。";
    exits = {
        west: 'fb/gumu/houtang',
    };

    constructor() {
        super();
        this.set_item('qin', '古琴', '一张年代久远的焦尾琴，琴弦仍然完好。', [
            ['gumu_qin', '弹奏古琴', this.playQin],
        ]);
    }

    playQin(me: USER) {
        if (this.fb_query_temp('gumu_summoned', me, false)) return me.notify('琴声余韵未绝，杨过与小龙女已经现身。');
        this.fb_set_temp('gumu_summoned', true, me);
        const xiaolongnv = NPC.CLONE('fb/gumu/xiaolongnv');
        const yangguo = NPC.CLONE('fb/gumu/yangguo');
        this.item_changed(xiaolongnv, true);
        this.item_changed(yangguo, true);
        me.send_room('$N轻抚琴弦，一曲终了，小龙女与杨过从石门后缓步走出。');
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'west' && this.fb_query_temp('gumu_yangguo', me, false)) {
            this.add_exit('east', 'fb/gumu/anhe');
        }
    }
}
