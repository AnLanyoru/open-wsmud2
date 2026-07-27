import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '风雷堂';
    desc = '风雷堂前悬着两面巨鼓，山风穿堂而过，鼓皮便发出沉闷如雷的震响。';
    exits = {
        south: 'fb/heimu/shulin',
        north: 'fb/heimu/fl_lang',
    };
}
