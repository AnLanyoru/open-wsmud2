import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山坡';
    exits = {
        west: 'fb/guangming/shanpo1',
        east: 'fb/guangming/xuantianshi',
    };
}
