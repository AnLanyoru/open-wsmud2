import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '内堂';
    desc = '内堂陈设精巧，屏风上绘着江南烟雨，一名易容术精湛的侍女安静守候。';
    exits = {
        west: 'fb/yanzi/houting',
    };

    constructor() {
        super();
        this.set_npc('fb/yanzi/shinv');
    }
}
