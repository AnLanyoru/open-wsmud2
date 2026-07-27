import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '侧房';
    desc = '侧房内摆着一张硬木床和几只兵器架，空气中残留着药酒与桐油混杂的气味。';
    exits = {
        east: 'fb/wenfu/zoulang1',
    };
}
