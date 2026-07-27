import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '通元谷';
    desc = '谷中松柏蔽日，清泉沿石缝流淌，四周回音空幽，似乎已无路可继续前行。';
    exits = {
        south: 'fb/hengshan/guolaoling',
    };
}
