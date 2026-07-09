import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '练功房';
    exits = {
        south: 'fb/hengshan/donglang',
    };
}
