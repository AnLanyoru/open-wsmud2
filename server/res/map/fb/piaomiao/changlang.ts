import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '长廊';
    desc = '雕花长廊横贯内宫，东西两侧分列戏凤阁与蓼风轩，北边花香随风飘来。';
    exits = {
        north: 'fb/piaomiao/huayuan',
        south: 'fb/piaomiao/dating',
        east: 'fb/piaomiao/wuqi',
        west: 'fb/piaomiao/liangong',
    };
}
