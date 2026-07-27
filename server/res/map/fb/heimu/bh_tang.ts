import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '白虎堂';
    desc = '白虎堂门楣雕着猛虎浮纹，两侧兵刃架寒光闪烁，北面长廊通往议事大厅。';
    exits = {
        south: 'fb/heimu/shangu',
        north: 'fb/heimu/bh_lang',
    };
}
