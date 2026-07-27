import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '练武场';
    desc = '宽阔场地铺着洁白细沙，木桩和兵器架排列整齐，地面却散落着新鲜蛇蜕。';
    exits = {
        west: 'fb/baituo/changlang',
        north: 'fb/baituo/menlang',
        south: 'fb/baituo/damen',
    };

    constructor() {
        super();
        this.set_npc('fb/baituo/ouyangfeng');
    }
}
