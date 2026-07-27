import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '玄冰洞';
    desc = '洞内万年玄冰折射出幽蓝光华，冰柱之间寒风呼啸，向东可见一座横跨冰火交界的天然石台。';
    exits = {
        east: 'fb/yinyang/pingtai',
    };
}
