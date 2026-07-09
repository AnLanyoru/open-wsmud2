import { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';
import AoBai from '../../../npc/bj/ao/aobai.js';

export default class extends ROOM {
    name = '卧房';
    desc =
        "这是鳌拜的卧房。鳌拜躺在床上睡着了，粗声粗气地打着呼噜。北边有一扇<cmd cmd='look door'>门(door)</cmd> 。";
    exits = { east: 'bj/ao/houyuan' };

    constructor() {
        super();
        this.set_npc('bj/ao/aobai');
        this.set_item('door', '', '这是一扇极厚的木门。', [['open', '打开', this.open_the_door]]);
    }

    open_the_door(me: USER) {
        var npc = this.find_obj_bypath('bj/ao/aobai') as AoBai;
        if (npc) {
            return npc.do_kill(me);
        }
        if (this.query_exits('north')) return me.notify('门已经打开了。');

        this.add_exit('north', 'bj/ao/andao');
    }
}
