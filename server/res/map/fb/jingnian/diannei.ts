import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '铜殿内部';
    exits = {
        south: 'fb/jingnian/tongdian',
    };
}
