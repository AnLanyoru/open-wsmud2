import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '一天门';
    desc = '石坊立在登山古道上，两侧苍柏森森，向北的山势开始陡峭起来。';
    exits = {
        south: 'fb/taishan/daizong',
        north: 'fb/taishan/ertian',
    };
}
