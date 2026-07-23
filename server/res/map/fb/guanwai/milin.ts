import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '密林';
    desc = '参天古木遮住了天光，林间只有一条被野兽踩出的窄路继续向东延伸。';
    exits = {
        east: 'fb/guanwai/milin2',
        west: 'fb/guanwai/baihe',
    };
}
