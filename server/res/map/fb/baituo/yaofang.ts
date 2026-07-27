import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '药房';
    desc = '药柜密布四壁，铜炉中煎着碧绿药汁，一名白衣少女守在炉边不许外人靠近。';
    exits = {
        north: 'fb/baituo/changlang',
    };

    constructor() {
        super();
        this.set_npc('fb/baituo/shaonv');
    }
}
