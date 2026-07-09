import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '石洞';
    exits = {
        east: 'fb/xiake/room_1',
        south: 'fb/xiake/room_2',
        north: 'fb/xiake/room_4',
        west: 'fb/xiake/room_3',
    };
}
