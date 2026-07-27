import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '半山亭';
    desc = '半山亭孤悬云外，冷风穿过石柱，冷谦持剑挡住继续登山的道路。';
    exits = {
        southeast: 'fb/guangming/shanlu',
        north: 'fb/guangming/banshanyao',
    };

    constructor() {
        super();
        this.set_npc('fb/guangming/lengqian');
    }
}
