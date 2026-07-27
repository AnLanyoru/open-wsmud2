import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '失足岩';
    desc = '岩壁向外倾斜，脚下碎石不断滚落深谷，只有一线狭路连接上下两段山崖。';
    exits = {
        south: 'fb/piaomiao/ya',
        north: 'fb/piaomiao/jian',
    };
}
