import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '钟楼';
    desc = "古钟悬在横梁之间，<cmd cmd='look bell'>钟声</cmd>可提示黑影动向；<cmd cmd='look window'>楼窗</cmd>外是刻有长生二字的深谷。";
    exits = {
        southeast: 'fb/jingnian/baishi',
    };

    constructor() {
        super();
        this.set_item('bell', '古钟', '在钟楼等待攻略所述的黑影提示，之后依所选路线追往铜殿或后山。', [['wait', '等待黑影', this.wait_bell]]);
        this.set_item('window', '楼窗', '取得和氏璧后，可从钟楼跃下进入长生门。', [['jump', '跳楼入长生门', this.jump]]);
    }

    wait_bell(me: USER) {
        const route = this.fb_query_temp('jingnian_route', me, '');
        if (!['sengwang', 'shaoshuai'].includes(route)) return me.notify('你所选路线没有在钟楼等候黑影的步骤。');
        this.fb_set_temp('jingnian_bell', true, me);
        me.notify(route === 'sengwang' ? '你看见一个黑影扑向铜殿，正可立即追入铜殿叫杀徐子陵。' : '你看见黑影冲出四大金刚包围，往后山与崖底方向奔去。');
    }

    jump(me: USER) {
        if (!this.fb_query_temp('jingnian_hebi', me, false)) return me.notify('你尚未取得和氏璧，不能完成跳楼入长生门的流程。');
        if (!this.fb_query_temp('jingnian_jump_score', me, false)) {
            this.fb_set_temp('jingnian_jump_score', true, me);
            me.add_fbscore(20, 100);
        }
        const room = this.query('fb/jingnian/changsheng');
        if (room) me.moveto(room, undefined, '$N纵身跃出钟楼，穿过云雾落入长生门。');
    }
}
