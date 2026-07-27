import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '长廊';
    desc = '彩绘长廊连接庄院东西，梁间垂着许多装药的葫芦，空气中弥漫着腥甜气味。';
    exits = {
        west: 'fb/baituo/ximen',
        east: 'fb/baituo/liangong',
        south: 'fb/baituo/yaofang',
    };
}
