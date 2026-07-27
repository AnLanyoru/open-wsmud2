import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '石台';
    desc = "石台悬在深渊上方，左侧玄冰坚逾精铁，右侧岩浆翻滚。藤蔓后藏着一个向下延伸的<cmd cmd='look hole'>漆黑山洞</cmd>。";
    exits = {
        north: 'fb/yinyang/shandong2',
        west: 'fb/yinyang/shandong',
    };

    constructor() {
        super();
        this.set_item('hole', '山洞', '藤蔓后的洞口热风扑面，下方似有金色火光游动。', [
            ['jump', '跳入山洞', this.jump_hole],
        ]);
    }

    jump_hole(me: USER) {
        const room = this.query('fb/yinyang/shandong3');
        if (room) me.moveto(room, undefined, '$N拨开藤蔓，纵身跳进灼热的洞窟。');
    }
}
