import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '星宿海';
    desc = '这里的水色深紫，岸边插满写着颂词的旗幡，风吹过时发出杂乱刺耳的猎猎声。';
    exits = {
        south: 'fb/xingxiu/xxh4',
        northeast: 'fb/xingxiu/xxh1',
    };
}
