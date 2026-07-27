import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '仙愁门';
    desc = '两根天然石柱夹成险门，门额刻着“仙愁”二字，过门便是通往灵鹫宫的大道。';
    exits = {
        south: 'fb/piaomiao/jian',
        north: 'fb/piaomiao/dadao',
    };
}
