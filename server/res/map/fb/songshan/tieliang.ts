import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '铁梁峡';
    desc = '两侧山壁犹如铁铸，峡中风声尖厉，乱石间留有许多新鲜剑痕。';
    exits = {
        southwest: 'fb/songshan/shandao',
        north: 'fb/songshan/chaotianmen',
    };
}
