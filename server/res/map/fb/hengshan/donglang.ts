import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '东廊';
    desc = '东廊墙上挂着恒山剑法图谱，北端练功房中不断传来长剑破风之声。';
    exits = {
        west: 'fb/hengshan/baiyunan',
        north: 'fb/hengshan/liangongfang',
    };
}
