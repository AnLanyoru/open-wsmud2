import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '桃花林';
    desc = '桃树密密匝匝，落英遮住所有道路。一株古桃树的枝条依次指向东、北、西三方。';

    constructor() {
        super();
        this.set_item('tree', '桃树', '古桃树枝条随风摆动，似乎暗藏出阵顺序。', [
            ['taohua_east', '向东', this.stepEast],
            ['taohua_north', '向北', this.stepNorth],
            ['taohua_west', '向西', this.stepWest],
            ['taohua_south', '向南', this.stepSouth],
        ]);
    }

    stepEast(me: USER) {
        this.step(me, 'east');
    }

    stepNorth(me: USER) {
        this.step(me, 'north');
    }

    stepWest(me: USER) {
        this.step(me, 'west');
    }

    stepSouth(me: USER) {
        this.step(me, 'south');
    }

    step(me: USER, dir: string) {
        const order = ['east', 'north', 'west'];
        const current = this.fb_query_temp('taohua_step', me, 0) as number;
        if (dir !== order[current]) {
            this.fb_set_temp('taohua_step', 0, me);
            me.notify('你走错一步，四周桃影旋转，转眼又回到了桃林入口。');
            return;
        }
        const next = current + 1;
        this.fb_set_temp('taohua_step', next, me);
        if (next < order.length) return me.notify('你依照枝条指向穿过一重桃影，前方路径仍在变化。');
        me.notify('三步走完，纷乱桃影骤然分开，露出了桃林出口。');
        const target = this.query('fb/taohua/taolinchukou');
        if (target) me.moveto(target);
    }
}
