import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山坡';
    desc = '坡势越发险峻，积雪藏在岩缝之间，前方悬天石突兀伸出云海。';
    exits = {
        west: 'fb/guangming/shanpo1',
        east: 'fb/guangming/xuantianshi',
    };
}
