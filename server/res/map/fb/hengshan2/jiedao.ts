import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '衡阳西街';
    desc = '青石街面冷冷清清，刘府方向不时传来兵刃交击声，沿街百姓早已闭门躲避。';
    exits = {
        east: 'fb/hengshan2/hengyang',
        north: 'fb/hengshan2/liufumen',
    };
}
