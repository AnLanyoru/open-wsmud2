import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '前庭';
    desc = '庭中松柏修剪得整整齐齐，四名太保分据四角，气机彼此呼应。';
    exits = {
        southdown: 'fb/songshan/shanmen',
        north: 'fb/songshan/chanyuan',
    };

    constructor() {
        super();
        this.set_npc(['fb/songshan/taibao10', 4]);
    }
}
