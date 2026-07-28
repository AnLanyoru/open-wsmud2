import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '后殿';
    desc = "后殿供桌上摆着一只<cmd cmd='look bowl'>旧瓷碗</cmd>，墙后传来空洞回声，似乎藏着通往内院的密道。";
    exits = {
        west: 'fb/heimu/chengdedian',
    };

    constructor() {
        super();
        this.set_item('bowl', '瓷碗', '一只压在供桌机关上的旧瓷碗，似乎可以转动。', [
            ['turn', '转动', this.turn_bowl],
        ]);
    }

    turn_bowl(me: USER) {
        const room = this.query('fb/heimu/midao1');
        if (room) me.moveto(room, '$N转动瓷碗，墙后轰然露出一条漆黑密道。');
    }
}
