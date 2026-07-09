import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大厅';
    exits = {
        west: 'fb/yanzi/qianyuan',
        north: 'fb/yanzi/houting',
    };
}
