import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '仙愁门';
    exits = {
        south: 'fb/piaomiao/jian',
        north: 'fb/piaomiao/dadao',
    };
}
