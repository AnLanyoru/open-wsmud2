import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '密林';
    desc = '密林深处光线昏暗，地面铺满腐叶。北边的树木稍显稀疏，西面可以返回白河方向。';
    exits = {
        west: 'fb/guanwai/milin',
        north: 'fb/guanwai/milin3',
    };
}
