import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '密林';
    exits = {
        north: 'fb/heimu/fl_tang',
        south: 'fb/heimu/tx_tang',
        west: 'fb/heimu/shangu',
        east: 'fb/heimu/up1',
    };
}
