import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '白石广场';
    exits = {
        northwest: 'fb/jingnian/zhonglou',
        east: 'fb/jingnian/houshan',
    };
}
