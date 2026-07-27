import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '熔石窟';
    desc = "洞窟岩壁被烤得赤红，烛照沐浴在炽烈金焰之中，一道<cmd cmd='look fissure'>熔岩裂隙</cmd>在其身后通向地底。";

    constructor() {
        super();
        this.set_npc('fb/yinyang/zhuzhao');
        this.set_item('fissure', '熔岩裂隙', '裂隙一路向下，赤红岩浆流向阴阳谷最深处。', [
            ['descend', '沿裂隙下行', this.descend],
        ]);
    }

    descend(me: USER) {
        if (this.is_here('fb/yinyang/zhuzhao'))
            return me.notify('烛照喷出的金焰封住了熔岩裂隙。');
        const room = this.query('fb/yinyang/rongyan');
        if (room) me.moveto(room, undefined, '$N沿着熔岩裂隙谨慎下行。');
    }
}
