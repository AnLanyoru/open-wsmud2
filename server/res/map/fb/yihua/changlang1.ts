import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '玫瑰廊';
    desc = '鲜红玫瑰攀满回廊木架，花瓣纷飞如雨，另有两名宫女封住通往两宫的岔路。';
    exits = {
        southwest: 'fb/yihua/yaoyue',
        southeast: 'fb/yihua/lianxing',
        north: 'fb/yihua/changlang',
    };

    constructor() {
        super();
        this.set_npc(['fb/yihua/gongnü', 2]);
    }
}
