import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '大清龙脉';
    desc = '山腹石室幽深寒冷，石壁上凿着蜿蜒如龙的纹路。传说中的大清龙脉就在此处，至于闯王宝藏仍不知所踪。';
    exits = {
        south: 'fb/guanwai/pubuxia',
    };
}
