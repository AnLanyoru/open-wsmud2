import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '花园';
    desc = '园中尽是西域奇花，浓香掩住毒草气息，青衣少女坐在花架下冷眼旁观。';
    exits = {
        south: 'fb/baituo/menlang',
        north: 'fb/baituo/dating',
    };

    constructor() {
        super();
        this.set_npc('fb/baituo/xiaoqing');
    }
}
