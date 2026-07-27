import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '会盟堂';
    desc = '堂内悬着五岳盟旗，左冷禅端坐主位，双掌间不断散出森寒白气。';
    exits = {
        south: 'fb/songshan/zhongmen',
        north: 'fb/songshan/jianchi',
        west: 'fb/songshan/xilang',
        east: 'fb/songshan/donglang',
    };

    constructor() {
        super();
        this.set_npc('fb/songshan/zuo');
    }
}
