import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '望日台';
    desc = '高台伸出云海，视野辽阔，晨昏时万道霞光洒在衡山诸峰之上。';
    exits = {
        west: 'fb/hengshan2/shiziyan',
        south: 'fb/hengshan2/zhurongdian',
    };
}
