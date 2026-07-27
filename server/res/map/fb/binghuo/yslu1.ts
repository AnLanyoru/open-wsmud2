import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '岩石路';
    desc = '脚下岩石温热开裂，硫磺气息扑面而来，一头炎龙从嶙峋石缝间飞快爬出。';
    exits = {
        east: 'fb/binghuo/haibian',
        west: 'fb/binghuo/yslu2',
    };

    constructor() {
        super();
        this.set_npc('fb/binghuo/yanlong');
    }
}
