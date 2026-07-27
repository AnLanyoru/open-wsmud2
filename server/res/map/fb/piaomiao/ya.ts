import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '断魂崖';
    desc = '断魂崖山风呼啸，乱石间乌老大与不平道人并肩守路，杀气笼罩狭窄山径。';
    exits = {
        north: 'fb/piaomiao/yan',
        south: 'fb/piaomiao/shanjiao',
    };

    constructor() {
        super();
        this.set_npc('fb/piaomiao/wulaoda', 'fb/piaomiao/buping');
    }
}
