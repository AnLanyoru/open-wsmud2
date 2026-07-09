import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '星宿海';
    exits = {
        south: 'fb/xingxiu/xxh4',
        northeast: 'fb/xingxiu/xxh1',
    };
}
