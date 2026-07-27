import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '祝融殿';
    desc = '古殿香火寥落，祝融神像俯视来客，殿后石阶直通衡山最高峰。';
    exits = {
        north: 'fb/hengshan2/wangritai',
        south: 'fb/hengshan2/zhurongfeng',
    };
}
