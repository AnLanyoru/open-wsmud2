import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '七星岩';
    desc = '七块巨岩依北斗之势排列，岩缝中火光明灭，脚下热浪翻涌，南方石台已被冰火两气侵蚀。';
    exits = {
        south: 'fb/yinyang/pingtai',
    };
}
