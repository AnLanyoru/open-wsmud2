import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '悬崖';
    desc = "吊篮停在两段绝壁之间，第二只<cmd cmd='look basket'>机关匣</cmd>刻着青龙，铁索在山风中剧烈摇晃。";
    exits = {
        south: 'fb/heimu/up1',
    };

    constructor() {
        super();
        this.set_item('basket', '铁匣', '铁匣上的青龙凹槽等待对应令牌。', [
            ['cross', '插入令牌', this.cross],
        ]);
    }

    cross(me: USER) {
        if (!this.fb_query_temp('heimu_qinglong', me, false)) return me.notify('你缺少青龙堂令牌，吊篮无法继续。');
        this.add_exit('north', 'fb/heimu/up3');
        me.notify('青龙令归位，吊篮越过第二段绝壁。');
    }
}
