import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '熔岩炼狱';
    desc = "赤红岩浆在脚下奔涌，灼热气浪扭曲了视线。前方冰火二气交汇成一道<cmd cmd='look vortex'>阴阳旋涡</cmd>，通往谷底核心。";

    constructor() {
        super();
        this.set_item('vortex', '阴阳旋涡', '冰火气流彼此纠缠，旋涡后隐约显出一座古老深谷。', [
            ['enter', '穿过旋涡', this.enter_valley],
        ]);
    }

    enter_valley(me: USER) {
        const room = this.query('fb/yinyang/yyg');
        if (room) me.moveto(room, undefined, '$N运功护体，穿过冰火交织的阴阳旋涡。');
    }
}
