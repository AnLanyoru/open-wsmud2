import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '东廊';
    exits = {
        west: 'fb/songshan/huimengtang',
    };
}
