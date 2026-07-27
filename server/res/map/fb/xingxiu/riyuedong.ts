import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '日月洞';
    desc = '洞顶镶着日月形磷石，幽光照见满墙毒功图谱，丁春秋端坐石台接受门人朝拜。';
    exits = {
        south: 'fb/xingxiu/xxh1',
    };

    constructor() {
        super();
        this.set_npc('fb/xingxiu/dingchunqiu');
    }
}
