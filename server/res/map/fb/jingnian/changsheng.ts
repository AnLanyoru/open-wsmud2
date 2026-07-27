import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '长生门';
    desc = "石门后别有洞天，壁上七幅人形图与和氏璧光芒彼此呼应。中央<cmd cmd='look mural'>长生图</cmd>标志着本路线终点。";
    exits = {
        south: 'fb/jingnian/zhonglou',
    };

    constructor() {
        super();
        this.set_item('mural', '长生图', '携和氏璧跳楼进入长生门后，在此完成净念禅宗路线。', [['finish', '参悟长生门', this.finish]]);
    }

    finish(me: USER) {
        if (!this.fb_query_temp('jingnian_hebi', me, false)) return me.notify('没有和氏璧，长生图始终黯淡无光。');
        if (this.fb_query_temp('jingnian_finished', me, false)) return me.notify('你已完成这次净念禅宗路线。');
        this.fb_set_temp('jingnian_finished', true, me);
        me.notify('和氏璧异力照亮七幅长生图，你完成了净念禅宗所选路线。');
    }
}
