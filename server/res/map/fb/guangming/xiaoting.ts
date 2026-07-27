import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '小厅';
    desc = '偏厅陈设简朴，墙上挂着历代教主画像，北门通向清静的后院。';
    exits = {
        east: 'fb/guangming/shenghuotang',
        north: 'fb/guangming/houyuan',
    };
}
