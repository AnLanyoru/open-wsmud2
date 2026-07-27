import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '南天门';
    desc = '赤色山门屹立峰头，穿过门洞便是岱顶，四周罡风吹散了浓重云气。';
    exits = {
        southdown: 'fb/taishan/shiba3',
        north: 'fb/taishan/yuhuang',
    };
}
