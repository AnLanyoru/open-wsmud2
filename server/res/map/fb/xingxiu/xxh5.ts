import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '星宿海';
    desc = '浅水间浮着斑斓油光，芦苇叶缘尽数发黑，摘星子站在一块干燥礁石上。';
    exits = {
        north: 'fb/xingxiu/xxh3',
        southwest: 'fb/xingxiu/xxh6',
    };

    constructor() {
        super();
        this.set_npc('fb/xingxiu/zhaixingzi');
    }
}
