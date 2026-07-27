import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '卧室';
    desc = '卧房布置简朴，一名须发花白的老顽童抱着石匣躲在床后，见人便跃跃欲试。';
    exits = {
        south: 'fb/taohua/dating',
    };

    constructor() {
        super();
        this.set_npc('fb/taohua/zhoubotong');
    }

    on_set_difficulty = (type: number) => {
        if (type !== 1) return;
        const npc = this.find_by_path('fb/taohua/zhoubotong');
        if (npc) npc.destroy();
    };
}
