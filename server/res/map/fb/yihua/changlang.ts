import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '桂花廊';
    desc = '桂花廊下香气清甜，两侧垂着细密珠帘，两名宫女按剑而立，冷眼注视来客。';
    exits = {
        south: 'fb/yihua/changlang1',
        north: 'fb/yihua/yihuage',
    };

    constructor() {
        super();
        this.set_npc(['fb/yihua/gongnü', 2]);
    }
}
