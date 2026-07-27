import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '上清殿';
    desc = '殿内供着三清神像，香烟缭绕间余沧海负手而立，阴沉目光牢牢锁定闯入者。';
    exits = {
        south: 'fb/qingcheng/caochang',
    };

    constructor() {
        super();
        this.set_npc('fb/qingcheng/yucanghai');
    }
}
