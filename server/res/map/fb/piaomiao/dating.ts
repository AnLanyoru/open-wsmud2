import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '独尊厅';
    desc = '独尊厅高阔肃穆，正中宝座空置，九部旗帜沿墙排列，北面长廊通往内宫。';
    exits = {
        north: 'fb/piaomiao/changlang',
        south: 'fb/piaomiao/damen',
    };
}
