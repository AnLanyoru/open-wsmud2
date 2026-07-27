import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '云梦沼泽';
    desc = '芦苇密得遮住视线，水下不时传来沉闷撞击，两条巨鳄堵住了退路。';
    exits = {
        south: 'fb/yunmeng/zhaoze2',
        north: 'fb/yunmeng/huozhao1',
    };

    constructor() {
        super();
        this.set_npc(['fb/yunmeng/eyu', 2]);
    }
}
