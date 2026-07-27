import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '海滩';
    desc = '潮水拍打着金色沙滩，南面桃花如霞，却有一股奇异力量令林间路径变幻不定。';
    exits = { south: 'fb/taohua/taohualin' };
}
