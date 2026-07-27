import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大门';
    desc =
        "你来到了天龙寺大门前，只见气势恢弘的两个大门柱上刻有一付对联，红漆覆字，颇有点拨众生之意。抬头上望，门楣上一块黑木大匾，上题“崇圣寺”三个大字，笔意苍松。此乃正式寺名，但大理百姓叫惯了，都称之为“天龙寺”。门旁的<cmd cmd='look gate'>寺门</cmd>似乎可以带人离开。";
    exits = {
        south: 'fb/tianlong/talin',
    };

    constructor() {
        super();
        this.set_item('gate', '寺门', '巍峨寺门是带段誉离开天龙寺的必经之路。', [
            ['tianlong_leave', '带段誉离开', this.leaveTemple],
        ]);
    }

    leaveTemple(me: USER) {
        if (!this.fb_query_temp('tianlong_captured', me, false)) return me.notify('你还没有制住段誉。');
        if (me.query_fbscore() < 100) return me.notify('天龙寺高手仍在追击，此刻还无法安然离开。');
        me.notify('你带着段誉冲出寺门，身后钟声大作，天龙寺一役至此功成。');
    }
}
