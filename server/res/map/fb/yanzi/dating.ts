import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大厅';
    desc = '大厅悬着“以彼之道”匾额，紫檀桌椅分列两侧，后方门户通往供奉先祖之处。';
    exits = {
        west: 'fb/yanzi/qianyuan',
        north: 'fb/yanzi/houting',
    };
}
