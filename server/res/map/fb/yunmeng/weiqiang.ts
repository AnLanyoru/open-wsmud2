import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '围墙';
    desc = '一段残破土墙孤立在沼泽中，墙砖爬满青苔，东面隐约可见一间茅屋。';
    exits = {
        south: 'fb/yunmeng/zhaoze3',
        east: 'fb/yunmeng/maowu',
    };
}
