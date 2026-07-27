import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '虎风口';
    desc = '山口风声如虎啸，狭窄石径贴着绝壁盘旋，田伯光正提刀挡在通往峰顶的路上。';
    exits = {
        northwest: 'fb/hengshan/guolaoling',
        south: 'fb/hengshan/daziling',
    };

    constructor() {
        super();
        this.set_npc('fb/hengshan/tian30');
    }
}
