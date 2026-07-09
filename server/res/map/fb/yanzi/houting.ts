import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '后厅';
    exits = {
        south: 'fb/yanzi/dating',
        east: 'fb/yanzi/neitang',
    };
}
