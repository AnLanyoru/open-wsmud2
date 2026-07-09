import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '南院';
    exits = {
        west: 'fb/wudu/xiangfang',
        east: 'fb/wudu/yaoshi',
        south: 'fb/wudu/liandu',
        north: 'fb/wudu/lianwu',
    };
}
