import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '走廊';
    desc = '回廊贴着院墙向北延伸，漆柱间挂着昏黄灯笼，西侧侧房门户紧闭。';
    exits = {
        north: 'fb/wenfu/zoulang2',
        southeast: 'fb/wenfu/dating',
        west: 'fb/wenfu/wen2',
    };
}
