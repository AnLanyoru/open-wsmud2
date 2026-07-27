import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '斋堂';
    desc = '长桌上摆着简单素斋，铜钟与木鱼靠墙放置，一名师太闻声拔剑转身。';
    exits = {
        south: 'fb/hengshan/xilang',
    };

    constructor() {
        super();
        this.set_npc('fb/hengshan/shitai');
    }
}
