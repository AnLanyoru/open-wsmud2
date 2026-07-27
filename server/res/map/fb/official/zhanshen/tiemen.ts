import { ROOM } from '../../../../../core/room/room.js';
import type { USER } from '../../../../../core/char/user.js';

export default class extends ROOM {
    name = '玄铁门';
    desc = "一扇布满古老战痕的<cmd cmd='look gate'>玄铁巨门</cmd>嵌在山腹中，门后传来沉闷风声，地面石阶一路没入幽暗深处。";

    constructor() {
        super();
        this.set_item('gate', '玄铁门', '巨门看似沉重，中央掌印却残留着可供借力的凹痕。', [
            ['open', '推开铁门', this.open_gate],
        ]);
    }

    open_gate(me: USER) {
        const room = this.query('fb/official/zhanshen/yongdao');
        if (room) me.moveto(room, undefined, '$N按住门上掌印，运劲推开玄铁门走入地下。');
    }
}
