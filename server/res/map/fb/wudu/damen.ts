import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大门';
    desc =
        '一座大宅隐没在浓密山林间，高墙内毒烟隐现，朱门上绘着蟾蜍、蛇蝎等五毒图案。';
    exits = {
        east: 'fb/wudu/lianwu',
    };
}
