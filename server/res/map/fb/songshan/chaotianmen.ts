import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '朝天门';
    desc = '朝天门矗立在云雾之间，三名嵩山太保呈品字形列阵，剑锋一齐指来。';
    exits = {
        south: 'fb/songshan/tieliang',
        northup: 'fb/songshan/shanmen',
    };

    constructor() {
        super();
        this.set_npc(['fb/songshan/taibao5', 3]);
    }
}
