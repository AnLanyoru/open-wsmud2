import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '卧室';
    desc = "素净卧室只有石床与木案，墙上一幅<cmd cmd='look painting'>仕女图</cmd>中，女子所持长剑似乎暗指某方。";
    exits = {
        south: 'fb/gumu/houtang',
    };

    constructor() {
        super();
        this.set_item('painting', '仕女图', '画中仕女横剑而立，剑锋所向似藏着脱离古墓的线索。', [
            ['gumu_painting', '查看剑向', this.lookPainting],
        ]);
    }

    lookPainting(me: USER) {
        const directions = ['东', '南', '西', '北'];
        let direction = this.fb_query_temp('gumu_direction', me, '');
        if (!direction) {
            direction = directions[this.random(directions.length)];
            this.fb_set_temp('gumu_direction', direction, me);
        }
        me.notify(`你凝神细看，发现画中长剑剑尖正指向${direction}方。`);
    }
}
