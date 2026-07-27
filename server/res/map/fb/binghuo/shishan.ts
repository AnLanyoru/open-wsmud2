import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '石山';
    desc = '灰白石山被风雪磨得光滑，岩壁下有一道覆冰裂隙，隐约能听见洞内传来沉重呼吸声。';
    exits = {
        south: 'fb/binghuo/conglin2',
        west: 'fb/binghuo/shishan2',
    };

    constructor() {
        super();
        this.set_item('cave', '石洞', '岩壁裂隙后藏着一条狭窄石洞，可以侧身钻入。', [
            ['enter_cave', '进入', this.enter_cave],
        ]);
    }

    enter_cave(me: USER) {
        const target = this.query('fb/binghuo/xiongdong');
        if (target) me.moveto(target, '$N拨开裂隙外的冰棱，侧身钻进了石洞。');
    }
}
