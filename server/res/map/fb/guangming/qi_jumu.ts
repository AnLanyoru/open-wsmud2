import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '巨木旗';
    exits = {
        north: 'fb/guangming/qi_ruijin',
        east: 'fb/guangming/qi_houtu',
    };
}
