import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '星宿海';
    desc = '腥臭泥沼冒着细密气泡，几株毒草在风中摇曳，天狼子正守着通往深处的小径。';
    exits = {
        north: 'fb/xingxiu/xxh2',
        southeast: 'fb/xingxiu/xxh6',
    };

    constructor() {
        super();
        this.set_npc('fb/xingxiu/tianlangzi');
    }
}
