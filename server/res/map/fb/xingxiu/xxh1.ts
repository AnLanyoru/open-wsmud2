import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '星宿海';
    exits = {
        southwest: 'fb/xingxiu/xxh2',
        southeast: 'fb/xingxiu/xxh3',
        north: 'fb/xingxiu/riyuedong',
    };
}
