import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '断崖';
    desc = '断崖前再无去路，碎石不断坠入深谷，烈火旗营地就在西面不远处。';
    exits = {
        west: 'fb/guangming/qi_liehuo',
    };
}
