import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '祝融殿';
    exits = {
        north: 'fb/hengshan2/wangritai',
        south: 'fb/hengshan2/zhurongfeng',
    };
}
