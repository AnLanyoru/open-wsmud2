import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '十八盘';
    desc = '石阶层层叠叠直上云端，脚下深谷令人目眩，攀登起来极为吃力。';
    exits = {
        southdown: 'fb/taishan/ertian',
        northup: 'fb/taishan/longmen',
    };
}
