import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '花园';
    desc = '峰顶花园四季如春，奇花异草掩映亭台，北侧石径盘向更高处的闭关室。';
    exits = {
        west: 'fb/piaomiao/woshi',
        east: 'fb/piaomiao/chufang',
        south: 'fb/piaomiao/changlang',
        north: 'fb/piaomiao/xiaodao',
    };
}
