import { ROOM } from '../../../../core/room/room.js';
import type { USER } from '../../../../core/char/user.js';

export default class extends ROOM {
    name = '拦江岛';
    desc =
        "孤岛横锁江心，黑色礁岩被浪涛拍得轰鸣不绝。魔师庞班立于最高处，岸边停着一叶可循原路返回的<cmd cmd='look boat'>归舟</cmd>。";

    constructor() {
        super();
        this.set_npc('fb/cihang/pangban');
        this.set_item('boat', '归舟', '岸边停着来时的轻舟，可以循原路返回帝塔峰。', [
            ['return', '返回帝塔峰', this.return_peak],
        ]);
    }

    return_peak(me: USER) {
        if (!this.fb_query_temp('cihang_pangban', me, false))
            return me.notify('庞班的气机锁住江面，你无法安然离岛。');
        const room = this.query('fb/cihang/shanmen');
        if (room) me.moveto(room, undefined, '$N驾舟离开拦江岛，循云水回到帝塔峰。');
    }
}
