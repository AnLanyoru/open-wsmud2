import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '阴阳谷';
    desc = '谷底一半冰封万载，一半烈焰冲天，烛九阴盘踞在阴阳交界线上，睁眼为昼，闭眼为夜。';
    exits = {
        north: 'fb/yinyang/rongyan',
    };

    constructor() {
        super();
        this.set_npc('fb/yinyang/zhujiuyin');
    }
}
