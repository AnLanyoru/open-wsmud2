import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '洪荒古泽';
    desc = '古泽深处寸草不生，遍地焦骨，一头庞大的火龙王盘踞在熔岩裂隙旁。';
    exits = {
        south: 'fb/yunmeng/huozhao2',
        north: 'fb/yunmeng/huozhao4',
    };

    constructor() {
        super();
        this.set_npc('fb/yunmeng/longwang');
    }
}
