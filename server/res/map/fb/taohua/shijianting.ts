import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '试剑亭';
    desc = '六角小亭立在竹林边，亭柱遍布细密剑痕，石桌上还散落着几枚被指力洞穿的棋子。';
    exits = {
        north: 'fb/taohua/xiaolu',
        east: 'fb/taohua/damen',
    };
}
