import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '走廊';
    desc = '廊下风声渐紧，青砖上散落着练棍留下的木屑，东北方可见一处开阔尽头。';
    exits = {
        south: 'fb/wenfu/zoulang1',
        northeast: 'fb/wenfu/zoulangtou',
        west: 'fb/wenfu/wen3',
    };
}
