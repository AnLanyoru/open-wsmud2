import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '洪水旗';
    desc = '营中水渠盘绕，蓝旗随水雾飘动，唐洋手持分水刺守在渠边。';
    exits = {
        west: 'fb/guangming/qi_houtu',
        east: 'fb/guangming/shanya',
        north: 'fb/guangming/qi_liehuo',
    };

    constructor() {
        super();
        this.set_npc('fb/guangming/tangyang');
    }
}
