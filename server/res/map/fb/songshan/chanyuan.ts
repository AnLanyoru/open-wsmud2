import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '峻极禅院';
    desc = '禅院外表清幽，院内却剑拔弩张，青砖地上散落着练剑用的木桩。';
    exits = {
        south: 'fb/songshan/qianting',
        north: 'fb/songshan/zhongmen',
    };
}
