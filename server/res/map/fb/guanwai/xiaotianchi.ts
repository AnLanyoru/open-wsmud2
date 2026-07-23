import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '小天池';
    desc = '一泓碧水嵌在雪山之间，池水东流汇成一道瀑布。附近巨石上有新鲜的熊爪印。';
    exits = {
        west: 'fb/guanwai/heifengkou',
        east: 'fb/guanwai/pubu',
    };

    constructor() {
        super();
        this.set_npc('bj/guanwai/xiong');
    }
}
