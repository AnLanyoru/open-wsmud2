import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '塔林';
    desc = '数十座古塔错落在苍松之间，石径覆着青苔，尽头便是供奉舍利的高塔。';
    exits = {
        north: 'fb/tianlong/damen',
        south: 'fb/tianlong/ta',
    };
}
