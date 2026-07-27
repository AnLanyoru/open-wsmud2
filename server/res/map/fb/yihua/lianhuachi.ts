import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '莲花池';
    desc = '莲池碧水映着宫墙，大片白莲随风轻摆，池畔残灯照出一条隐秘退路。';
    exits = {
        east: 'fb/yihua/xiaojing',
    };
}
