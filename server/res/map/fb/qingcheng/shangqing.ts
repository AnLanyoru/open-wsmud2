import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '上清宫';
    exits = {
        north: 'fb/qingcheng/songfeng',
    };
}
