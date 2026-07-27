import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大字岭';
    desc = '大字岭是入恒山必由之路，石壁镌着两丈高的“恒宗”二字，笔力遒劲，云气缭绕。';
    exits = {
        north: 'fb/hengshan/hufengkou',
    };
}
