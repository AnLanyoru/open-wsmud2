import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '见性峰';
    desc = '峰顶视野开阔，白云庵坐落在苍松之间，青瓦素墙显得清净而庄严。';
    exits = {
        north: 'fb/hengshan/baiyunan',
        west: 'fb/hengshan/beiyuedian',
    };
}
