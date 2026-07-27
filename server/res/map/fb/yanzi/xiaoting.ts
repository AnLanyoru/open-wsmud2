import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '小厅';
    desc = '小厅临湖而建，窗外荷叶连天，一名慕容侍女守着桌上的琴谱默然不语。';
    exits = {
        west: 'fb/yanzi/yunjinlou',
    };

    constructor() {
        super();
        this.set_npc('fb/yanzi/shinv');
    }
}
