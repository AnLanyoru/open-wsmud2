import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '门廊';
    desc = '汉白玉门廊雕满蛇形纹饰，两侧灯罩内并非烛火，而是闪着幽光的磷石。';
    exits = {
        south: 'fb/baituo/liangong',
        north: 'fb/baituo/huayuan',
    };
}
