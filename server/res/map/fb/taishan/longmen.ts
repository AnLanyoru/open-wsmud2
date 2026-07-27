import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '龙门';
    desc = '两峰对峙如门，山风从峡口呼啸而出，陡峭石径在前方继续盘旋。';
    exits = {
        southdown: 'fb/taishan/shiba1',
        northup: 'fb/taishan/shiba2',
    };
}
