import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '石阶';
    exits = {
        south: 'fb/jingnian/shanmen',
        north: 'fb/jingnian/dianmen',
    };
}
