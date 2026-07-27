import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大厅';
    desc = '大厅梁柱粗壮，墙上悬着刀枪棍棒，左右两条回廊通向温家众人的侧房。';
    exits = {
        south: 'fb/wenfu/dayuan',
        northwest: 'fb/wenfu/zoulang1',
        northeast: 'fb/wenfu/zoulang4',
    };
}
