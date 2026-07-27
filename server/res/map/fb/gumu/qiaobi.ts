import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '峭壁';
    desc = "湿滑峭壁垂直向上，脚下暗河奔腾不息，头顶隐约可见一方凸出的<cmd cmd='look cliff'>石台峭壁</cmd>。";
    exits = {
        down: 'fb/gumu/anhe',
    };

    constructor() {
        super();
        this.set_item('cliff', '峭壁', '石壁虽湿滑，几处突出的岩角仍可借力攀登。', [
            ['gumu_climb', '攀上平台', this.climb],
        ]);
    }

    climb(me: USER) {
        this.add_exit('up', 'fb/gumu/pingtai');
        me.notify('你借着岩角奋力攀爬，终于能够登上上方平台。');
    }
}
