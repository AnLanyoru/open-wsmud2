import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '前厅';
    desc = '前厅由整块青石砌成，长明灯映着冰冷墙壁，东西甬道幽深而寂静。';
    exits = {
        west: 'fb/gumu/gumukou',
        east: 'fb/gumu/houtang',
    };
}
