import type { USER } from '../../../core/char/user.js';
import { ROOM } from '../../../core/room/room.js';
import { WORLD } from '../../../core/world.js';

export function queryLongmaiRoom(path: string, me: USER) {
    return WORLD.getRoom(path)?.query_copy2(me);
}

export default class extends ROOM {
    name = '入口石室';
    desc =
        "石门之后是一座宽阔石室，地面沟槽盘曲相承，北壁留有一篇<cmd cmd='look shike'>斑驳石刻</cmd>，北侧门洞前伏着一只石甲蝎。";
    exits = { north: 'longmai/canbeit' };

    constructor() {
        super();
        this.set_npc('bj/lm/xiezi');
        this.set_item(
            'shike',
            '石刻',
            '石刻写着：「残碑藏生息，刀痕留余音；地气、兵煞与龙吟，似乎皆与井下封禁有着关联。」字迹虽经岁月侵蚀，仍可反复辨读。',
        );
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'north' && this.find_by_path('bj/lm/xiezi')) {
            return me.notify_fail('你隐约感觉门洞前的石甲蝎与此处禁制气息相连，此刻尚无隙可入。');
        }
    }
}
