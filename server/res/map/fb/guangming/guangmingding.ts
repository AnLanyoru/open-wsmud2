import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '光明顶';
    desc = '峰顶广场战痕遍地，六大派与明教混战方休，说不得和彭莹玉仍守在要道。';
    exits = {
        north: 'fb/guangming/qi_houtu',
        south: 'fb/guangming/xiaolu1',
    };

    constructor() {
        super();
        this.set_npc('fb/guangming/shuobude');
        this.set_npc('fb/guangming/pengyingyu');
    }
}
