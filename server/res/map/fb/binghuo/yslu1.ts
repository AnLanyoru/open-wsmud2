import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '岩石路';
    exits = {
        east: 'fb/binghuo/haibian',
        west: 'fb/binghuo/yslu2',
    };
}
