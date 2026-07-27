import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '青龙堂';
    desc = '青龙堂梁柱涂成墨青，铜制龙灯沿墙排列，一条幽暗走廊向堂内延伸。';
    exits = {
        north: 'fb/heimu/shangu',
        south: 'fb/heimu/ql_lang',
    };
}
