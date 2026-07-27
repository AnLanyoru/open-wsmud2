import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '侧房';
    desc = '侧房门窗紧闭，柜中散出淡淡药香，床边还放着尚未擦净的练功长棍。';
    exits = {
        west: 'fb/wenfu/zoulang4',
    };
}
