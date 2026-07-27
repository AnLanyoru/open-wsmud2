import { ROOM } from '../../../../core/room/room.js';
import { NPC } from '../../../../core/char/npc.js';

export default class extends ROOM {
    name = '熊洞';
    desc = '洞内铺着干草和熊皮，深处却有人类生活留下的石灶，一位金发盲眼汉子盘坐其旁。';
    exits = { out: 'fb/binghuo/shishan' };

    constructor() {
        super();
        this.set_npc('fb/binghuo/xiexun');
    }

    on_set_difficulty = (type: number) => {
        if (type === 1) NPC.CREATE('fb/binghuo/zhangwuxia', this);
    };
}
