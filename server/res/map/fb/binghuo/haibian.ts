import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '海边岩石';
    desc = '黑色火山岩伸入冰冷海水，西方浓烟遮天，北面寒林覆雪，冷热两股气流在此交汇。';
    exits = {
        west: 'fb/binghuo/yslu1',
        north: 'fb/binghuo/conglin1',
    };
}
