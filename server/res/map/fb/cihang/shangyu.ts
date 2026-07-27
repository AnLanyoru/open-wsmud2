import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '赏雨亭';
    desc = "飞檐小亭临着深谷，浪翻云负剑凭栏。亭外云海中系着一叶通往<cmd cmd='look boat'>拦江岛</cmd>的轻舟。";
    exits = {
        east: 'fb/cihang/xiaolu2',
    };

    constructor() {
        super();
        this.set_npc('fb/cihang/langfanyun');
        this.set_item('boat', '轻舟', '完成浪翻云、靳冰云与遗书流程后，可乘舟前往拦江岛。', [['sail', '前往拦江岛', this.sail]]);
    }

    sail(me: USER) {
        if (!this.fb_query_temp('cihang_lang_passed', me, false)) return me.notify('你尚未完成浪翻云与靳冰云的前置流程。');
        const room = this.query('fb/cihang/lanjiang');
        if (room) me.moveto(room, undefined, '$N解开缆绳，驾一叶轻舟穿过云海。');
    }
}
