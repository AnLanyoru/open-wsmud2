import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '云梦沼泽';
    desc = '枯木横卧在浑水之间，腥风扑面，两双幽绿眼睛正从泥潭中逼近。';
    exits = {
        west: 'fb/yunmeng/zhaoze2',
        north: 'fb/yunmeng/weiqiang',
    };

    constructor() {
        super();
        this.set_npc(['fb/yunmeng/eyu', 2]);
    }
}
