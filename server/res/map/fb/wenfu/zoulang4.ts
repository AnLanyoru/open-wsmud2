import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '走廊';
    desc = '这段走廊临近大厅，脚步声在屋檐下回荡，东边侧房里似乎有人屏息静候。';
    exits = {
        north: 'fb/wenfu/zoulang3',
        southwest: 'fb/wenfu/dating',
        east: 'fb/wenfu/wen5',
    };
}
