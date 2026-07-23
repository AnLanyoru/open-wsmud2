import type { USER } from '../../../core/char/user.js';
import { ROOM } from '../../../core/room/room.js';

export default class extends ROOM {
    name = '兵俑甬道';
    desc =
        "甬道两侧立着披甲兵俑，残破铁甲下传出关节摩擦的细响。墙上的<cmd cmd='look daohen'>层叠刀痕</cmd>深浅相续，仿佛仍藏着未散的余音。";
    exits = { south: 'longmai/canbeit', north: 'longmai/wuxingdian' };

    constructor() {
        super();
        this.set_npc('bj/lm/yongwei');
        this.set_item(
            'daohen',
            '刀痕',
            '刀痕由浅而深，浅处残着细白石屑，中段凝有暗红铁锈，幽深裂隙的边缘则沾满井壁般的黑灰。你隐约感觉这些残迹与回荡之声有着关联。',
        );
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'north' && this.find_by_path('bj/lm/yongwei')) {
            return me.notify_fail('你隐约感觉披甲俑卫身上的兵煞牵动着甬道禁制，前路仍被封住。');
        }
    }
}
