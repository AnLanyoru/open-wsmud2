import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '崖底';
    desc = "崖底乱石遍地，寒潭水汽凝成白霜。一块<cmd cmd='look boulder'>沉重大石</cmd>卡在石缝间，正可用来抵御深水中的浮力。";
    exits = {
        southwest: 'fb/yinyang/hantan',
    };

    constructor() {
        super();
        this.set_item('boulder', '大石头', '巨石沉重圆钝，抱住它便可快速沉入寒潭深处。', [
            ['carry', '抱起巨石', this.carry_boulder],
        ]);
    }

    carry_boulder(me: USER) {
        if (this.fb_query_temp('yinyang_boulder', me, false))
            return me.notify('你已经抱稳了那块沉重巨石。');
        this.fb_set_temp('yinyang_boulder', true, me);
        me.notify('你运劲抱起巨石，步履沉重地走向碧水寒潭。');
    }
}
