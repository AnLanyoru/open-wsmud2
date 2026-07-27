import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大院';
    desc = '青石铺成的大院宽阔整洁，四周高墙森严，大厅中隐约传来温家人的低声议论。';
    exits = {
        north: 'fb/wenfu/dating',
    };

    constructor() {
        super();
        this.set_npc('fb/wenfu/wenlaoda');
    }
}
