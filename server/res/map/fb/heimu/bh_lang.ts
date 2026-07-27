import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '走廊';
    desc = '白虎堂长廊铺着灰白石砖，墙上虎纹旗帜猎猎作响，尽头隐约有人影守候。';
    exits = {
        north: 'fb/heimu/bh_ting',
        south: 'fb/heimu/bh_tang',
    };
}
