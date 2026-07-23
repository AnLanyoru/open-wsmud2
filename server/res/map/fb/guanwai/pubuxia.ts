import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '瀑布下';
    desc = '瀑布在这里汇成深潭，水雾终年不散，四周山石在水汽中显得模糊难辨。南面可返回瀑布。';
    exits = { south: 'fb/guanwai/pubu' };

    constructor() {
        super();
        this.add_action('observe', '观察地形', this.observe);
    }

    observe(me: USER) {
        const room = me.environment;
        if (!room || room.path !== this.path) return;
        if (room.query_exits('north')) return me.notify('你已经辨认出通往大清龙脉的方向了。');
        if (!me.find_obj_bypath('sp/bj/map')) return me.notify('没有实体地图作为参照，你无法辨认这里的地形。');
        room.add_exit('north', 'fb/guanwai/daqinglongmai');
        return me.notify('你对照实体地图仔细观察，辨认出北面通往大清龙脉的道路。');
    }
}
