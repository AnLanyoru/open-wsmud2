import { NPC } from '../../../../core/char/npc.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '剑冢';
    desc = '无数残剑插满荒冢，凛冽剑意在半空汇聚成形，石壁上依稀刻着独孤求败的旧字。';
    exits = {
        west: 'fb/gumu/pingtai',
    };

    constructor() {
        super();
        this.set_npc('fb/gumu/jianling');
    }

    on_set_difficulty = (type: number) => {
        if (type !== 1) return;
        const swordSpirit = this.find_by_path('fb/gumu/jianling');
        if (swordSpirit) swordSpirit.destroy();
        NPC.CREATE('fb/gumu/jianmo', this);
    };
}
