import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '星宿海';
    desc = '盐碱荒滩上散着几堆篝火，浑浊水洼映出铅灰天空，星宿弟子的号声从北方传来。';
    exits = {
        northeast: 'fb/xingxiu/xxh5',
        northwest: 'fb/xingxiu/xxh4',
    };

    constructor() {
        super();
        this.set_npc('fb/xingxiu/azi');
    }
}
