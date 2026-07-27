import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '断肠崖';
    desc =
        "这里四面都是高山，左右皆是<cmd cmd='look cliff'>悬崖峭壁</cmd>，周围云海翻滚，远处山峰若隐若现。成群鸟儿掠过天际，一块块怪石屹立山巅，摇摇欲坠。";

    constructor() {
        super();
        this.set_item('cliff', '断崖', '崖下云雾翻滚，隐约可见谷底一泓碧水。', [
            ['jump', '纵身跳下', this.jump_cliff],
        ]);
    }

    jump_cliff(me: USER) {
        const room = this.query('fb/yinyang/yandi');
        if (room) me.moveto(room, undefined, '$N纵身跃下断崖，借山藤卸力落到谷底。');
    }
}
