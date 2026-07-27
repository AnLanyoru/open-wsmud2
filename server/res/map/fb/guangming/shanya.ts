import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山崖';
    desc = '陡峭山崖被水雾浸得湿滑，崖下激流轰鸣，这里并没有别的通路。';
    exits = {
        west: 'fb/guangming/qi_hongshui',
    };
}
