import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '北厢';
    exits = {
        south: 'fb/guangming/houyuan',
    };
}
