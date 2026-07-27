import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '小径';
    desc = '湖边小径穿过成片茶花，碎石路上落英缤纷，东面传来听雨居的檐铃声。';
    exits = {
        north: 'fb/yanzi/qianyuan',
        east: 'fb/yanzi/tingyuju',
    };
}
