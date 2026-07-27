import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '后院';
    desc = '院中石榴树枝叶扶疏，东西厢房门窗紧闭，与前方战场仿佛隔绝。';
    exits = {
        north: 'fb/guangming/bexiang',
        south: 'fb/guangming/xiaoting',
        west: 'fb/guangming/xixiang',
    };
}
