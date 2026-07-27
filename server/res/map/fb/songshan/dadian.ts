import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '中岳大殿';
    desc = '殿内香烟缭绕，中岳神像庄严肃穆，后方石门通向更为险峻的山道。';
    exits = {
        south: 'fb/songshan/tianzhongge',
        northup: 'fb/songshan/shandao',
    };
}
