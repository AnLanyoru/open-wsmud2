import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '北厢';
    desc = '北厢十分幽静，书架上整齐放着教中典籍，空气中留有淡淡墨香。';
    exits = {
        south: 'fb/guangming/houyuan',
    };
}
