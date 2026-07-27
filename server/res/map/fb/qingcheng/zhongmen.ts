import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '穿廊门';
    desc = '月洞门连接内外两院，门后长廊深邃阴凉，墙边青苔显示此处终年少见阳光。';
    exits = {
        south: 'fb/qingcheng/songfeng',
        north: 'fb/qingcheng/zoulang',
    };
}
