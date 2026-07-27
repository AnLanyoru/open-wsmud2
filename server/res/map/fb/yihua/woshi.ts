import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '卧室';
    desc = "卧室布置得清雅绝俗，锦帐后的<cmd cmd='look bed'>玉床</cmd>紧贴墙壁，床脚留有一道细微摩擦痕迹。";
    exits = {
        northwest: 'fb/yihua/yaoyue',
        northeast: 'fb/yihua/lianxing',
    };

    constructor() {
        super();
        this.set_item('bed', '玉床', '玉床似乎能够推动，后方隐约传来空洞回声。', [
            ['push_bed', '推开', this.push_bed],
        ]);
    }

    push_bed(me: USER) {
        if (!this.fb_query_temp('yihua_palace', me, false)) return me.notify('玉床纹丝不动，或许应先击败一位宫主。');
        if (!this.query_exits('south')) this.add_exit('south', 'fb/yihua/midao');
        me.send_room('$N运劲推开玉床，露出一条向下的暗道。');
    }
}
