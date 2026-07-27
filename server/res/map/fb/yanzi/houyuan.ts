import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '后院';
    desc = '后院遍植山茶与修竹，石径在花木间曲折延伸，南端可见云锦楼飞檐。';
    exits = {
        north: 'fb/yanzi/tingyuju',
        south: 'fb/yanzi/yunjinlou',
    };
}
