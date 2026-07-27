import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '小楼';
    desc = '小楼内陈设古雅，窗纸被月光映得惨白，一名手持金蛇剑的男子静静立在中央。';
    exits = {
        south: 'fb/wenfu/xiaoyuan',
    };

    constructor() {
        super();
        this.set_npc('fb/wenfu/jinshe');
    }
}
