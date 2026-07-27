import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '桃林出口';
    desc = '身后桃林仍如迷雾般深不可测，前方一条青石小路蜿蜒通向岛中精雅庄院。';
    exits = {
        south: 'fb/taohua/xiaolu',
    };
}
