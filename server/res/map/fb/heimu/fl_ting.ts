import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大厅';
    desc = '风雷堂内鼓声低沉，童百熊须发怒张，双掌带着风雷之势迎面而来。';
    exits = {
        south: 'fb/heimu/fl_lang',
    };

    constructor() {
        super();
        this.set_npc('fb/heimu/tongbaixiong');
    }
}
