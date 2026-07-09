import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '涟星宫';
    exits = {
        northwest: 'fb/yihua/changlang1',
        southwest: 'fb/yihua/woshi',
    };
}
