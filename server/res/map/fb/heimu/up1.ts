import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '悬崖';
    desc = "绝壁间只剩一道深不见底的裂谷，崖边<cmd cmd='look basket'>铁匣</cmd>上刻着白虎图纹，吊篮悬在对岸。";
    exits = {
        west: 'fb/heimu/shulin',
    };

    constructor() {
        super();
        this.set_item('basket', '铁匣', '铁匣凹槽形似白虎堂令牌，可借机关召回吊篮。', [
            ['cross', '插入令牌', this.cross],
        ]);
    }

    cross(me: USER) {
        if (!this.fb_query_temp('heimu_baihu', me, false)) return me.notify('铁匣毫无反应，你缺少白虎堂令牌。');
        this.add_exit('north', 'fb/heimu/up2');
        me.notify('白虎令嵌入铁匣，吊篮沿铁索滑到崖边。');
    }
}
