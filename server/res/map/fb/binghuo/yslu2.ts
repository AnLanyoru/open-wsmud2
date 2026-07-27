import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '岩石路';
    desc = '赤红岩浆在路旁沟壑中缓缓流淌，两头炎龙伏在热浪里，堵住通往火山的道路。';
    exits = {
        west: 'fb/binghuo/huoshanjiao',
        east: 'fb/binghuo/yslu1',
    };

    constructor() {
        super();
        this.set_npc(['fb/binghuo/yanlong', 2]);
    }
}
