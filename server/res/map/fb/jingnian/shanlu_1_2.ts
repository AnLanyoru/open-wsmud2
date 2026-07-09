import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山路';
    exits = {
        southwest: 'fb/jingnian/shanlu_1',
        north: 'fb/jingnian/yandi',
    };
}
