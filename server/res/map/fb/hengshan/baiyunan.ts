import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '白云庵';
    desc = '庵堂正中佛灯长明，东西回廊通向僧舍，北面后殿传来低沉诵经声。';
    exits = {
        west: 'fb/hengshan/xilang',
        east: 'fb/hengshan/donglang',
        south: 'fb/hengshan/jianxingfeng',
        north: 'fb/hengshan/houdian',
    };
}
