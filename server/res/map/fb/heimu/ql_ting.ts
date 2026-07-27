import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大厅';
    desc = '青龙堂大厅灯火幽暗，墙上青龙盘柱，长老贾布横刀挡住来路。';
    exits = {
        north: 'fb/heimu/ql_lang',
    };

    constructor() {
        super();
        this.set_npc('fb/heimu/jiabu');
    }
}
