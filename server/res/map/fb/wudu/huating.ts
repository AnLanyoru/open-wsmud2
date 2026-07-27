import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '花厅';
    desc = '花厅中陈列着各类苗疆器物，银饰在灯下泛着冷光，窗外毒花随夜风轻轻摇曳。';
    exits = {
        west: 'fb/wudu/huayuan',
        north: 'fb/wudu/huating2',
    };

    constructor() {
        super();
        this.set_npc('fb/wudu/jiaotu');
    }
}
