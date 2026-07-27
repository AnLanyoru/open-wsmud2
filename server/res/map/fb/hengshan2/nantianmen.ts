import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '南天门';
    desc = '石门横跨山道，门额古字被风雨磨蚀，穿门而过便可望见更高处的峰峦。';
    exits = {
        northwest: 'fb/hengshan2/shanlu',
        north: 'fb/hengshan2/shiziyan',
    };
}
