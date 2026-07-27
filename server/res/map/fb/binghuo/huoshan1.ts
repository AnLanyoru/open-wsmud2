import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '火山';
    desc = '火山口岩浆翻涌如沸，一头披着暗红鳞甲的炎龙王盘踞其间，发出震耳咆哮。';
    exits = {
        east: 'fb/binghuo/huoshanjiao',
    };

    constructor() {
        super();
        this.set_npc('fb/binghuo/yanlongwang');
    }
}
