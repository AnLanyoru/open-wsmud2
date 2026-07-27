import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '侧房';
    desc = '屋内堆着练功木桩与石锁，墙角一盏油灯摇曳，将人影拉得忽长忽短。';
    exits = {
        east: 'fb/wenfu/zoulang2',
    };
}
