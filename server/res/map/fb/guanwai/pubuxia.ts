import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '瀑布下';
    exits = {
        south: 'fb/guanwai/pubu',
    };
}
