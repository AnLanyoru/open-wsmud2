import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '花园';
    desc = '园中花朵色彩艳丽得近乎妖异，石径旁蛛网密布，草叶下不时闪过细长黑影。';
    exits = {
        west: 'fb/wudu/dating',
        east: 'fb/wudu/huating',
        north: 'fb/wudu/huayuan2',
    };

    constructor() {
        super();
        this.set_npc('fb/wudu/duwu');
    }
}
