import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '碎石小路';
    desc = '小路依着峭壁向西延伸，路边野花沾满雨露，远处赏雨亭半隐在翻涌的白色云海之中。';
    exits = {
        east: 'fb/cihang/guangchang',
        west: 'fb/cihang/shangyu',
    };
}
