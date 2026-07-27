import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '西廊';
    desc = '长廊贴着院墙延伸，墙上悬挂历代掌门画像，寒风穿窗而过。';
    exits = {
        east: 'fb/songshan/huimengtang',
    };
}
