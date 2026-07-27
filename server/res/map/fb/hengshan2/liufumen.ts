import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '刘府大门';
    desc = '朱漆大门半开，门前散落着折断的剑鞘，两名嵩山弟子持剑封住去路。';
    exits = {
        south: 'fb/hengshan2/jiedao',
        north: 'fb/hengshan2/liufudayuan',
    };

    constructor() {
        super();
        this.set_npc(['fb/hengshan2/dizi', 2]);
    }
}
