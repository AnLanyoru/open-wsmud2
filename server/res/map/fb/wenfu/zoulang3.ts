import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '走廊';
    desc = '东侧回廊曲折幽深，栏杆上布满刀剑划痕，远处隐约可见一座小亭。';
    exits = {
        northwest: 'fb/wenfu/zoulangtou',
        south: 'fb/wenfu/zoulang4',
        east: 'fb/wenfu/wen4',
    };
}
