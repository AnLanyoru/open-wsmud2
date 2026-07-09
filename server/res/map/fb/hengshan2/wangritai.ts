import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '望日台';
    exits = {
        west: 'fb/hengshan2/shiziyan',
        south: 'fb/hengshan2/zhurongdian',
    };
}
