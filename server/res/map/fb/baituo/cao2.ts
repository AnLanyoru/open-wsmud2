import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '草丛';
    desc = '草木愈发茂密，林地遍布白骨与蛇穴，第二条毒蛇从枯叶下猛然昂首吐信。';
    exits = {
        north: 'fb/baituo/zhulin',
        south: 'fb/baituo/cao1',
    };

    constructor() {
        super();
        this.set_npc('fb/baituo/dushe');
    }
}
