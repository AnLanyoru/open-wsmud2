import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '松花江上';
    desc = '松花江水浩浩荡荡，两岸相隔甚远。江面浮冰随着急流起伏，只有熟悉水势的船夫敢在此摆渡。';
    exits = {
        east: 'fb/guanwai/damen',
        west: 'fb/guanwai/chuanchang',
    };

    constructor() {
        super();
        this.set_npc('bj/guanwai/chuanfu');
    }
}
