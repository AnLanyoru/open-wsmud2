import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '走廊';
    desc = '黑石长廊贴着山壁修筑，窗外云海翻滚，北端大厅传来雄浑呼喝之声。';
    exits = {
        north: 'fb/heimu/fl_ting',
        south: 'fb/heimu/fl_tang',
    };
}
