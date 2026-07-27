import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '厢房';
    desc = '厢房内悬着苗疆织锦，桌上摆满毒囊与暗器，一名疤面女子冷冷注视着来客。';
    exits = {
        east: 'fb/wudu/nanyuan',
    };

    constructor() {
        super();
        this.set_npc('fb/wudu/hehongyao');
    }
}
