import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '慈航殿';
    desc = '大殿庄严素净，白玉慈航像垂目而坐，殿内没有香火喧扰，只有若有若无的梵唱回荡梁间。';
    exits = {
        north: 'fb/cihang/guangchang',
    };
}
