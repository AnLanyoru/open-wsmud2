import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '崖底';
    desc = "崖底乱石遍布，三名高手守在一线天光下。陡峭<cmd cmd='look cliff'>崖壁</cmd>上留有可供借力的裂隙。";
    exits = {
        south: 'fb/jingnian/shanlu_2',
    };

    constructor() {
        super();
        this.set_npc(['fb/jingnian/yandigaoshou', 3]);
        this.set_npc('fb/jingnian/kouzhong');
        this.set_npc('fb/jingnian/tuobahan');
        this.set_item('cliff', '崖壁', '击败盗帅线崖底三人组后，可凭四千级基本轻功跃回禅院。', [['jump', '跳上崖壁', this.jump]]);
    }

    jump(me: USER) {
        if (this.fb_query_temp('jingnian_route', me, '') !== 'daoshuai') return me.notify('只有盗帅线需要由此跃回禅院。');
        if (this.is_here('fb/jingnian/yandigaoshou')) return me.notify('崖底三人组仍在围攻，你无法腾身跃起。');
        if (me.query_skill('dodge', 0) < 4000) return me.notify('你的基本轻功不足四千级，无法跃上陡峭崖壁。');
        const room = this.query('fb/jingnian/baishi');
        if (room) me.moveto(room, undefined, '$N踏着崖壁裂隙连纵数次，跃回白石广场。');
    }
}
