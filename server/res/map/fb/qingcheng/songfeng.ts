import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '松风观';
    desc = '古观掩映在苍松之间，风过松涛如剑鸣，一名青城弟子守在通往内院的门前。';
    exits = {
        south: 'fb/qingcheng/shangqing',
        north: 'fb/qingcheng/zhongmen',
    };

    constructor() {
        super();
        this.set_npc('fb/qingcheng/dizi');
    }
}
