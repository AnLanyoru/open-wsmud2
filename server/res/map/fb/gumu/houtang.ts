import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '后堂';
    desc = '后堂陈设古朴，北面卧室垂着素帘，东侧琴室隐约传来断续琴音。';
    exits = {
        west: 'fb/gumu/qianting',
        north: 'fb/gumu/woshi',
        east: 'fb/gumu/qinshi',
    };
}
