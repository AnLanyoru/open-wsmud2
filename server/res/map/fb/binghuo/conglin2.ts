import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '丛林';
    desc = '密林深处风雪更急，两头大白熊护着幼崽巢穴，人立起来发出低沉怒吼。';
    exits = {
        south: 'fb/binghuo/conglin1',
        north: 'fb/binghuo/shishan',
    };

    constructor() {
        super();
        this.set_npc(['fb/binghuo/baixiong', 2]);
    }
}
