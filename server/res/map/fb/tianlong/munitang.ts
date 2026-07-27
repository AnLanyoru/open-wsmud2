import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '牟尼堂';
    desc = '佛堂内青灯如豆，枯荣大师端坐正中，段誉被护在蒲团之后，三人气息凝重。';
    exits = {
        north: 'fb/tianlong/banruo',
    };

    constructor() {
        super();
        this.set_npc('fb/tianlong/kurong');
        this.set_npc('fb/tianlong/duanyu');
    }

    on_set_difficulty = (type: number) => {
        this.set_temp('tianlong_hard', type === 1);
    };
}
