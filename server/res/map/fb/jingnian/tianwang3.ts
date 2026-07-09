import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '广目天王殿';
    exits = {
        southeast: 'fb/jingnian/daxiong',
    };
}
