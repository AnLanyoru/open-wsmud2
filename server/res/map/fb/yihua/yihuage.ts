import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '移花阁';
    desc = '白玉筑成的高阁横在宫门之后，纱幔间寒香浮动，一名白衣女子正守住去路。';
    exits = {
        north: 'fb/yihua/damen',
        south: 'fb/yihua/changlang',
    };

    constructor() {
        super();
        this.set_npc('fb/yihua/huayuenü');
    }
}
