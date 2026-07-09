import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '花园';
    exits = {
        west: 'fb/qingcheng/caochang',
        north: 'fb/qingcheng/woshi',
    };
}
