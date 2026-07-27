import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '花丛';
    desc = '名贵茶花夹道盛放，花枝间露出通往庄门的青石小路，湖风送来淡淡水气。';
    exits = {
        east: 'fb/yanzi/zhuangmen',
        west: 'fb/yanzi/anbian',
    };
}
