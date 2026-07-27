import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '练武场';
    desc = '场中插满淬毒兵刃，几名教众正在演练诡异招式，青石地面留下斑驳腐蚀痕迹。';
    exits = {
        west: 'fb/wudu/damen',
        east: 'fb/wudu/dating',
        south: 'fb/wudu/nanyuan',
    };

    constructor() {
        super();
        this.set_npc(['fb/wudu/jiaotu', 2]);
    }
}
