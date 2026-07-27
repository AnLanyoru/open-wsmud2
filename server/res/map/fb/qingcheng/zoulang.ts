import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '走廊';
    desc = '长廊两侧悬挂历代掌门画像，北面练武场传来整齐呼喝，南面穿廊门半掩。';
    exits = {
        south: 'fb/qingcheng/zhongmen',
        north: 'fb/qingcheng/caochang',
    };
}
