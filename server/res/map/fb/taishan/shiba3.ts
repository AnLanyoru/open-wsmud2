import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '十八盘';
    desc = '最后一段天梯几乎笔直，身后群峰已没入云海，南天门隐约可见。';
    exits = {
        southdown: 'fb/taishan/shengxian',
        northup: 'fb/taishan/nantian',
    };
}
