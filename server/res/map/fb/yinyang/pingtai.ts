import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '石台';
    exits = {
        north: 'fb/yinyang/shandong2',
        west: 'fb/yinyang/shandong',
    };
}
