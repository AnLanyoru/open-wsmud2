import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '听雨居';
    desc = '临水精舍竹帘半卷，檐角铜铃随风作响，南边曲廊一直伸向后院深处。';
    exits = {
        west: 'fb/yanzi/xiaojing',
        south: 'fb/yanzi/houyuan',
    };
}
