import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山谷';
    desc = '山谷被积雪围得密不透风，一名血刀弟子踏雪而来，弯刀上红芒刺目；谷底的血色足迹通向忘忧谷。';
    exits = {
        north: 'fb/xuedao/shankou',
        south: 'fb/xuedao/wangyou',
    };

    constructor() {
        super();
        this.set_npc('fb/xuedao/dizi');
        this.set_npc('fb/xuedao/laozu');
    }
}
