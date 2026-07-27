import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大厅';
    desc = '大厅梁上垂着彩色纱幔，五毒教徽高悬正中，幽绿灯火把四周照得阴森诡谲。';
    exits = {
        west: 'fb/wudu/lianwu',
        east: 'fb/wudu/huayuan',
    };

    constructor() {
        super();
        this.set_npc(['fb/wudu/jiaotu', 3]);
    }
}
