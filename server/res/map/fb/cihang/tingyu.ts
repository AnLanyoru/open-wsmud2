import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '听雨亭';
    desc = '亭外竹叶承雨，滴答声清越如琴，石桌上留有半盏冷茶，北侧石阶通往收藏历代典籍的高塔。';
    exits = {
        south: 'fb/cihang/diancangta',
        west: 'fb/cihang/xiaolu1',
    };
}
