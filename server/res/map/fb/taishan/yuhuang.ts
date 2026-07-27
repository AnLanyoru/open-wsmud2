import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '玉皇顶';
    desc = '玉皇顶上天地开阔，日观峰云海壮阔，最后一名泰山长老在此等候。';
    exits = {
        south: 'fb/taishan/nantian',
    };

    constructor() {
        super();
        this.set_npc('fb/taishan/yuyin2');
    }
}
