import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '走廊';
    desc = '走廊两侧绘着青龙腾云壁画，脚步声在狭长过道中回荡，前方刀气森然。';
    exits = {
        north: 'fb/heimu/ql_tang',
        south: 'fb/heimu/ql_ting',
    };
}
