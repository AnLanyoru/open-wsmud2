import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大厅';
    desc = '白虎堂大厅悬着猛虎下山图，上官云披着白氅守在堂主座前。';
    exits = {
        south: 'fb/heimu/bh_lang',
    };

    constructor() {
        super();
        this.set_npc('fb/heimu/shangguanyun');
    }
}
