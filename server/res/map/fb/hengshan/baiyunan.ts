import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '白云庵';
    exits = {
        west: 'fb/hengshan/xilang',
        east: 'fb/hengshan/donglang',
        south: 'fb/hengshan/jianxingfeng',
        north: 'fb/hengshan/houdian',
    };
}
