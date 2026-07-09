import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '洪水旗';
    exits = {
        west: 'fb/guangming/qi_houtu',
        east: 'fb/guangming/shanya',
        north: 'fb/guangming/qi_liehuo',
    };
}
