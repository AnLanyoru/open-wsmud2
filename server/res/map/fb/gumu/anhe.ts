import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '暗河';
    desc =
        "地下暗河寒冷刺骨，激流没过胸口，四个方向皆是黑暗水道，唯有剑向能够指路；<cmd cmd='look 东'>东</cmd>、<cmd cmd='look 南'>南</cmd>、<cmd cmd='look 西'>西</cmd>、<cmd cmd='look 北'>北</cmd>方水道各有一线生机。";
    exits = {
        west: 'fb/gumu/qinshi',
    };

    constructor() {
        super();
        for (const direction of ['东', '南', '西', '北']) {
            this.set_item(direction, `${direction}方水道`, `一条通往${direction}方的幽暗水道。`, [
                [
                    `gumu_swim_${direction}`,
                    `向${direction}游`,
                    (me: USER) => this.swim(me, direction),
                ],
            ]);
        }
    }

    swim(me: USER, direction: string) {
        const answer = this.fb_query_temp('gumu_direction', me, '');
        if (!answer) return me.notify('你尚未找到指引暗河方向的线索。');
        if (me.hp < me.max_hp) return me.notify('暗河水势凶险，你必须先恢复全部气血再下水。');
        if (answer !== direction) {
            me.add_hp(-Math.max(1, Math.floor(me.max_hp / 3)));
            return me.notify('你游入错误水道，被汹涌暗流卷回原处，气血损失三成。');
        }
        this.add_exit('up', 'fb/gumu/qiaobi');
        me.notify('你顺着剑向游过激流，终于摸到一处可以攀爬的峭壁。');
    }
}
