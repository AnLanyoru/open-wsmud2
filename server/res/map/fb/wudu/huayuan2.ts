import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '花园';
    desc = '北园更加幽暗，参差花木间飘着淡紫毒烟，通往腾蛟亭的小径若隐若现。';
    exits = {
        south: 'fb/wudu/huayuan',
        east: 'fb/wudu/huating2',
    };

    constructor() {
        super();
        this.set_npc('fb/wudu/duwu');
    }
}
