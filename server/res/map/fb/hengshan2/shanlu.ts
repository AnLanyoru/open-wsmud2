import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山路';
    desc = '山路顺着衡山蜿蜒而上，苍松夹道，远处群峰在薄雾中若隐若现。';
    exits = {
        west: 'fb/hengshan2/hengyang',
        southeast: 'fb/hengshan2/nantianmen',
    };
}
