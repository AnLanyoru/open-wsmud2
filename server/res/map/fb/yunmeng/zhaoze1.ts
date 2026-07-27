import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '云梦沼泽';
    desc = '泥水没过脚踝，腐叶下不断冒出气泡，一条巨鳄伏在芦苇阴影中。';
    exits = {
        west: 'fb/yunmeng/senlin',
        north: 'fb/yunmeng/zhaoze2',
    };

    constructor() {
        super();
        this.set_npc('fb/yunmeng/eyu');
    }
}
