import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '星宿海';
    desc = '碎石小径夹在两片毒沼之间，出尘子手执拂尘，正低头检查草丛里的毒虫。';
    exits = {
        south: 'fb/xingxiu/xxh5',
        northwest: 'fb/xingxiu/xxh1',
    };

    constructor() {
        super();
        this.set_npc('fb/xingxiu/chuchenzi');
    }
}
