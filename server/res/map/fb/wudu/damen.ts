import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大门';
    desc =
        '这里是一座隐没于山林中的大宅院，高高的围墙，朱红的大门，好象是一座有钱人家的避暑别院。 ';
    exits = {
        east: 'fb/wudu/lianwu',
    };
}
