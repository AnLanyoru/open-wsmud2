import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '戏凤阁';
    desc = '阁中木桩与软垫排列整齐，墙上挂着灵鹫宫弟子练功所用的长剑与丝带。';
    exits = {
        east: 'fb/piaomiao/changlang',
    };
}
