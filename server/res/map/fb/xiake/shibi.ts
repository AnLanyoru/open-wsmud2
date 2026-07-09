import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '石壁';
    exits = {
        east: 'fb/xiake/shimen',
        south: 'fb/xiake/neiting',
    };
}
