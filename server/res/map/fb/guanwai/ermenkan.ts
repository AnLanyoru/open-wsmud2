import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '二门坎子';
    desc = '两侧山岩在此骤然收拢，形成第二道天然门坎。山风从狭窄的谷口呼啸而过，一只金雕在头顶盘旋。';
    exits = {
        southwest: 'fb/guanwai/damen',
        east: 'fb/guanwai/mantianxing',
    };

    constructor() {
        super();
        this.set_npc('bj/guanwai/diao');
    }
}
