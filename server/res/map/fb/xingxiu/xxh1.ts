import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '星宿海';
    desc = '两路水道在此汇合，北面日月洞阴风阵阵，狮吼子提刀封住唯一可走的石梁。';
    exits = {
        southwest: 'fb/xingxiu/xxh2',
        southeast: 'fb/xingxiu/xxh3',
        north: 'fb/xingxiu/riyuedong',
    };

    constructor() {
        super();
        this.set_npc('fb/xingxiu/shihouzi');
    }
}
