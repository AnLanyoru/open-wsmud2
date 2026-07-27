import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '憩凤阁';
    desc = '憩凤阁内床帐洁净，香炉中余烟未散，似乎宫中弟子刚刚匆忙离去。';
    exits = {
        east: 'fb/piaomiao/huayuan',
    };
}
