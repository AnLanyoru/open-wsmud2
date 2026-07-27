import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '大门';
    desc =
        "这里就是成都大户温家的<cmd cmd='look men'>大门</cmd>，门口两个大石狮，威武异常，大门紧锁着，门上的铜环却亮得刺眼。围墙很高，门匾上写着两个烫金的大字“温府”，果然气度不凡。门的旁边有一株<cmd cmd='look tree'>参天大树</cmd>, 人站在下面很是凉快。";

    constructor() {
        super();
        this.set_item('men', '温府大门', '大门从里面紧紧闩住，正面无法进入，只能另寻门路。');
        this.set_item('tree', '参天大树', '树干粗壮，伸出的枝桠恰好越过温府高墙。', [['jump', '攀树入府', this.jump_tree]]);
    }

    jump_tree(me: USER) {
        const room = this.query('fb/wenfu/dayuan');
        if (room) me.moveto(room, undefined, '$N攀上树梢，翻过高墙落入院中。');
    }
}
