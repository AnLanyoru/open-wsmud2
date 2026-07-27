import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '练毒室';
    desc = '石室地面刻着五毒阵纹，角落铁笼中窸窣作响，浓烈毒雾贴着地面翻涌。';
    exits = {
        north: 'fb/wudu/nanyuan',
    };

    constructor() {
        super();
        this.set_npc(['fb/wudu/duwu', 2]);
    }
}
