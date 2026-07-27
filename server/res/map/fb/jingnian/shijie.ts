import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '石阶';
    desc = '青石长阶沿山势笔直向上，两旁古柏遮天，晨钟与诵经声从高处禅院中隐约传来。';
    exits = {
        south: 'fb/jingnian/shanmen',
        north: 'fb/jingnian/dianmen',
    };
}
