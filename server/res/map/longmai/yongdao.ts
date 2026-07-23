import { ROOM } from '../../../core/room/room.js';

export default class extends ROOM {
    name = '幽暗甬道';
    desc = '甬道两侧立着披甲兵俑，残破铁甲下隐约传出关节摩擦的细响。';
    exits = { south: 'longmai/shimen', north: 'longmai/suolongjing' };

    constructor() {
        super();
        this.set_npc('bj/lm/yongwei');
    }
}
