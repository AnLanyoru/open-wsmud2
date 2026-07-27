import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '闭关室';
    desc = "闭关室深藏峰顶，石门隔绝风雪，室内<cmd cmd='look cushion'>蒲团</cmd>与药炉俱全，正适合童姥疗伤静养。";
    exits = {
        south: 'fb/piaomiao/xiaodao',
    };

    constructor() {
        super();
        this.set_item('cushion', '蒲团', '将天山童姥安置在蒲团上，她便可安心闭关疗伤。', [
            ['settle', '安置童姥', this.settle],
        ]);
    }

    settle(me: USER) {
        if (!this.fb_query_temp('piaomiao_saved', me, false)) return me.notify('你尚未救下天山童姥。');
        if (!this.fb_query_temp('piaomiao_carrying', me, false)) return me.notify('你没有背着天山童姥。');
        if (this.fb_query_temp('piaomiao_settled', me, false)) return me.notify('天山童姥已经在此闭关疗伤。');
        this.fb_set_temp('piaomiao_settled', true, me);
        this.fb_set_temp('piaomiao_carrying', false, me);
        me.notify('你将天山童姥安置妥当，她颔首命你自行取用灵鹫宫赏赐。');
    }
}
