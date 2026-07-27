import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '亭子';
    desc = '一座六角小亭藏在墙后，藤萝缠绕亭柱，北面小院寂静得听不见半点人声。';
    exits = {
        south: 'fb/wenfu/zoulangtou',
        north: 'fb/wenfu/xiaoyuan',
    };
}
