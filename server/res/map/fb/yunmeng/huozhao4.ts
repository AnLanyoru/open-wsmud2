import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '洪荒古泽';
    desc = '古泽尽头热浪渐息，灰白雾气笼罩水面，远处只剩野兽低沉的回声。';
    exits = {
        south: 'fb/yunmeng/honghuangguze',
    };
}
