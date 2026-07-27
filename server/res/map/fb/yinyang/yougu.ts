import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '幽谷';
    desc = "幽谷终年不见阳光，冰晶覆盖嶙峋石壁。幽荧盘踞在蓝色冷焰中央，头顶一条<cmd cmd='look vine'>粗大藤蔓</cmd>垂向岩洞。";
    exits = {
        west: 'fb/yinyang/hantan',
    };

    constructor() {
        super();
        this.set_npc('fb/yinyang/youying');
        this.set_item('vine', '藤蔓', '藤蔓表面结着薄冰，攀上去可抵达石壁高处的玄冰洞。', [
            ['climb', '攀爬藤蔓', this.climb],
        ]);
    }

    climb(me: USER) {
        if (this.is_here('fb/yinyang/youying'))
            return me.notify('幽荧掀起冰焰封住藤蔓，你无法靠近。');
        const room = this.query('fb/yinyang/shandong');
        if (room) me.moveto(room, undefined, '$N抓住藤蔓攀上石壁，钻入一座玄冰洞。');
    }
}
