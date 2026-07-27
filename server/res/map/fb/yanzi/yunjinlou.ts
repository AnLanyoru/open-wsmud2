import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '云锦楼';
    desc = '云锦楼中帷幔重重，名贵茶花沿窗盛放，王夫人持剑立在通往小厅的门前。';
    exits = {
        north: 'fb/yanzi/houyuan',
        east: 'fb/yanzi/xiaoting',
    };

    constructor() {
        super();
        this.set_npc('fb/yanzi/wangfuren');
    }
}
