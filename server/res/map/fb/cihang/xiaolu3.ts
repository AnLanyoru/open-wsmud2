import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '碎石小路';
    desc = '石径绕过一片苍翠山腰，茶香随风飘来，前方林木掩映处似乎藏着一条通往桃源深处的小径。';
    exits = {
        north: 'fb/cihang/xiaolu1',
        south2: 'fb/cihang/chayuan',
    };
}
