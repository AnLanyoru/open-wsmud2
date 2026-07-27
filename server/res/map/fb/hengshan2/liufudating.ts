import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '刘府大厅';
    desc = '大厅杯盘狼藉，刘正风与费斌正斗得激烈，剑光在梁柱之间往来如电。';
    exits = {
        east: 'fb/hengshan2/dongxiangfang',
        south: 'fb/hengshan2/liufudayuan',
        west: 'fb/hengshan2/xixiangfang',
    };

    constructor() {
        super();
        this.set_npc('fb/hengshan2/liu');
        this.set_npc('fb/hengshan2/fei');
    }
}
