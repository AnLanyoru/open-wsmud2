import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '瀑布';
    desc = '天池水从断崖倾泻而下，轰鸣声震耳欲聋。水帘后方似乎别有洞天，沿山路向北可绕到瀑布下方。';
    exits = {
        west: 'fb/guanwai/xiaotianchi',
        north: 'fb/guanwai/pubuxia',
    };
}
