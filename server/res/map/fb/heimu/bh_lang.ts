import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '走廊';
    exits = {
        north: 'fb/heimu/bh_ting',
        south: 'fb/heimu/bh_tang',
    };
}
