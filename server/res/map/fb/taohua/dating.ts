import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大厅';
    desc = '大厅陈设古雅，墙上悬着琴箫与书画，北通卧房，东侧书房飘来淡淡墨香。';
    exits = {
        west: 'fb/taohua/qianyuan',
        north: 'fb/taohua/woshi',
        east: 'fb/taohua/shufang',
    };
}
