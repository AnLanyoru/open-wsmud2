import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '走廊';
    exits = {
        north: 'fb/wenfu/zoulang2',
        southeast: 'fb/wenfu/dating',
        west: 'fb/wenfu/wen2',
    };
}
