import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '二天门';
    desc = '山门夹在峭壁之间，石阶覆着薄苔，一名泰山长老横剑守在此处。';
    exits = {
        south: 'fb/taishan/yitian',
        northup: 'fb/taishan/shiba1',
    };

    constructor() {
        super();
        this.set_npc('fb/taishan/yuji');
    }
}
