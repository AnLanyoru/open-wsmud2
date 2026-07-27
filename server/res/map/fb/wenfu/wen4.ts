import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '侧房';
    desc = '这间侧房收拾得十分整齐，桌面摊着八卦方位图，旁边搁着几根沉重铁棍。';
    exits = {
        west: 'fb/wenfu/zoulang3',
    };
}
