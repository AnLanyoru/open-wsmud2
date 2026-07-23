import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '瀑布下';
    desc = '瀑布在这里汇成深潭，水雾终年不散。南面可返回瀑布，北侧水帘后隐约露出一道通往山腹的石缝。';
    exits = {
        south: 'fb/guanwai/pubu',
        north: 'fb/guanwai/daqinglongmai',
    };
}
