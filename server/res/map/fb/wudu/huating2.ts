import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '腾蛟亭';
    desc = '腾蛟亭临水而建，彩栏盘绕如蛇，一名艳丽女子倚栏而立，铁钩寒光逼人。';
    exits = {
        south: 'fb/wudu/huating',
        west: 'fb/wudu/huayuan2',
    };

    constructor() {
        super();
        this.set_npc('fb/wudu/hetieshou');
    }
}
