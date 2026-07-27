import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '密道';
    desc = '密道低矮昏暗，石壁上留着油灯熏痕，尽头铁环已拉开通往花园的暗门。';
    exits = {
        south: 'fb/heimu/houdian',
        north: 'fb/heimu/huayuan',
    };
}
