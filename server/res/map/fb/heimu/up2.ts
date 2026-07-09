import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '悬崖';
    exits = {
        north: 'fb/heimu/up3',
        south: 'fb/heimu/up1',
    };
}
