import { ROOM } from '../../../core/room/room.js';

export default class extends ROOM {
    name = '残碑厅';
    desc =
        "厅中五块残碑按环形倒伏，中央立着一方可反复辨读的<cmd cmd='look canbei'>残碑</cmd>。";
    exits = { south: 'longmai/shimen', north: 'longmai/yongdao' };

    constructor() {
        super();
        this.set_item(
            'canbei',
            '残碑',
            '碑面残图早已漫漶，只见寒泉之畔生机萌动，枝影间隐现灯焰，余烬又没入厚土，土隙深处凝着一线冷芒。泉眼旁的旧刻似乎与整幅图意的起势有着关联。',
        );
    }
}
