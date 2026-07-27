import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '前院';
    desc = '前院宽阔整洁，东西两路分别通向大厅与庄门，南侧另有一条临水小径。';
    exits = {
        east: 'fb/yanzi/dating',
        west: 'fb/yanzi/zhuangmen',
        south: 'fb/yanzi/xiaojing',
    };
}
