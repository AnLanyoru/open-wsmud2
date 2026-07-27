import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '洪荒古泽';
    desc = '水面漂浮着焦枯树干，热气蒸腾，一头火龙在雾气中拍打赤红双翼。';
    exits = {
        south: 'fb/yunmeng/huozhao1',
        north: 'fb/yunmeng/honghuangguze',
    };

    constructor() {
        super();
        this.set_npc('fb/yunmeng/huolong');
    }
}
