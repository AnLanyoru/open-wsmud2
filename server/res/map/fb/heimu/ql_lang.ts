import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '走廊';
    exits = {
        north: 'fb/heimu/ql_tang',
        south: 'fb/heimu/ql_ting',
    };
}
