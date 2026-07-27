import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '草丛';
    desc = '荒草高及腰间，叶片沾着黏稠毒液，一条斑斓毒蛇正悄无声息地游近。';
    exits = {
        east: 'fb/baituo/ximen',
        south: 'fb/baituo/cao2',
    };

    constructor() {
        super();
        this.set_npc('fb/baituo/dushe');
    }
}
