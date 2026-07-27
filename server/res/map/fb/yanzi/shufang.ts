import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '书房';
    desc = '书房四壁排满武学典籍，案上摊着一幅山河图，慕容复正在灯下静候。';

    exits = {
        west: 'fb/yanzi/dating',
    };

    constructor() {
        super();
        this.set_npc('fb/yanzi/murongfu');
    }
}
