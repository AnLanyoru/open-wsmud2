import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '祝融峰';
    desc = '峰顶云气奔涌，脚下群山尽收眼底，凛冽长风吹得衣袂猎猎作响。';
    exits = {
        north: 'fb/hengshan2/zhurongdian',
    };
}
