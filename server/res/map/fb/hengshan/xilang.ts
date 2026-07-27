import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '西廊';
    desc = '西廊清幽整洁，木栏外种着几丛翠竹，斋堂中飘来淡淡米饭香气。';
    exits = {
        east: 'fb/hengshan/baiyunan',
        north: 'fb/hengshan/zaitang',
    };
}
