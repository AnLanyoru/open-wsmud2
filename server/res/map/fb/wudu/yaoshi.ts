import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '药室';
    desc = '药架上密密麻麻摆着瓶罐，炉中熬煮着乌黑药汁，刺鼻烟气不断从鼎口冒出。';
    exits = {
        west: 'fb/wudu/nanyuan',
    };

    constructor() {
        super();
        this.set_npc('fb/wudu/duwu');
    }
}
