import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '琴室';
    exits = {
        west: 'fb/gumu/houtang',
    };
}
