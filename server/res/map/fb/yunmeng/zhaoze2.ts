import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '云梦沼泽';
    exits = {
        south: 'fb/yunmeng/zhaoze1',
        east: 'fb/yunmeng/zhaoze3',
        north: 'fb/yunmeng/zhaoze4',
    };
}
