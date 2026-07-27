import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '还施水阁';
    desc = '水阁内书架直抵屋顶，天下武学分门别类收藏于此，一道苍老身影从暗处缓步现身。';

    exits = {
        south: 'fb/yanzi/houting',
    };

    constructor() {
        super();
        this.set_npc('fb/yanzi/murongbo');
    }
}
