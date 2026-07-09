import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '西门';
    exits = {
        east: 'fb/baituo/changlang',
    };
}
