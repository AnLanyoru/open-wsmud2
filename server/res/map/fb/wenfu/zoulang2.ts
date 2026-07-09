import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '走廊';
    exits = {
        south: 'fb/wenfu/zoulang1',
        northeast: 'fb/wenfu/zoulangtou',
        west: 'fb/wenfu/wen3',
    };
}
