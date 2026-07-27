import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '东廊';
    desc = '廊下摆着一列兵器架，长剑整齐陈列，地面结着一层薄薄寒霜。';
    exits = {
        west: 'fb/songshan/huimengtang',
    };
}
