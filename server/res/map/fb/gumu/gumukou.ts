import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '古墓入口';
    desc =
        '你发现自己已身处深谷之中，雾气蒙蒙，寒意逼人。四下是片不小的开阔地，一座一人高的白色球型圆冢孤立其中，墓后是阴森森的松林古木，更平添十分凄清落寞的萧瑟之意。墓门仅齐肩高，往内是古墓派所在。古墓传人历来不轻出江湖，但不少痴情男女仰慕杨龙二人双剑合壁快意江湖的豪情，历尽千般磨难后终成眷属惊世恋情。';
    exits = {
        east: 'fb/gumu/qianting',
    };
}
