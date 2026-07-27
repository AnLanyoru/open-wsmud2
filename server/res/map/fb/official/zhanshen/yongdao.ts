import { ROOM } from '../../../../../core/room/room.js';

export default class extends ROOM {
    name = '幽深甬道';
    desc = '甬道两壁刻满持兵征战的远古人影，脚步声在拱顶反复回荡，西方隐约透出星辰般的微光。';
    exits = {
        east: 'fb/official/zhanshen/tiemen',
        west: 'fb/official/zhanshen/shenshi',
    };
}
