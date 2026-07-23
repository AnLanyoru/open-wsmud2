import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '荒地';
    desc = '这里遍地都是枯草和乱石，积雪下不时传来树枝折断的声响，一头东北虎正在荒草间徘徊。';
    exits = {
        east: 'fb/guanwai/xuedi',
    };

    constructor() {
        super();
        this.set_npc('bj/guanwai/hu');
    }
}
