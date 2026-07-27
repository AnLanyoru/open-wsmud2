import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '西厢';
    desc = '西厢房内摆着旧木床与衣箱，窗外圣火光影在素白墙壁上微微晃动。';
    exits = {
        east: 'fb/guangming/houyuan',
    };
}
