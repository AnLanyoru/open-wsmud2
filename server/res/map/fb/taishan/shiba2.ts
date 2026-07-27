import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '十八盘';
    desc = '这一段石阶更加险峻，铁索贴着绝壁延伸，云雾在脚下翻滚不休。';
    exits = {
        southdown: 'fb/taishan/longmen',
        northup: 'fb/taishan/shengxian',
    };
}
