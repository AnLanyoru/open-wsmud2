import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '狮子岩';
    desc = '巨岩形如雄狮昂首，岩下古松虬曲，山风穿过石隙发出低沉呜咽。';
    exits = {
        south: 'fb/hengshan2/nantianmen',
        east: 'fb/hengshan2/wangritai',
    };
}
