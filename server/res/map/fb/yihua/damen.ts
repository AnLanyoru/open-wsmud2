import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大门';
    desc = '白玉宫门高耸在花海尽头，门柱雕满缠枝纹样，宫内寒香随风缓缓飘出。';
    exits = {
        south: 'fb/yihua/yihuage',
        north: 'fb/yihua/yihua1',
    };
}
