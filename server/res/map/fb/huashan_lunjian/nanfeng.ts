import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '南峰';
    exits = {
        north: 'fb/huashan_lunjian/tai',
    };
}
