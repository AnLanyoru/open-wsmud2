import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '练武场';
    desc = '练武场上剑架林立，青城弟子踏着松风步法往来演练，上清殿坐落在正北高阶之上。';
    exits = {
        south: 'fb/qingcheng/zoulang',
        east: 'fb/qingcheng/huayuan',
        north: 'fb/qingcheng/zhudian',
    };

    constructor() {
        super();
        this.set_npc('fb/qingcheng/dizi');
    }
}
