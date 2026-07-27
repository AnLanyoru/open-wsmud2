import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '广场';
    desc = '广场以整块青石铺成，中央莲池澄澈见底，东西碎石小径分别通向两座听雨赏雨的幽亭。';
    exits = {
        south: 'fb/cihang/zhudian',
        north: 'fb/cihang/qichongmen',
        west: 'fb/cihang/xiaolu2',
        east: 'fb/cihang/xiaolu1',
    };
}
