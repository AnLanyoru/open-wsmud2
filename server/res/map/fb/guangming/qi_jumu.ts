import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '巨木旗';
    desc = '粗大原木交错成寨，青旗覆满营地，闻苍松手执木杖立在阵前。';
    exits = {
        north: 'fb/guangming/qi_ruijin',
        east: 'fb/guangming/qi_houtu',
    };

    constructor() {
        super();
        this.set_npc('fb/guangming/wencangsong');
    }
}
