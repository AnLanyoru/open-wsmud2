import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山道';
    desc = '山道沿陡峭峰壁向北攀升，脚下碎石松动，抬头已能望见北岳殿厚重飞檐。';
    exits = {
        north: 'fb/hengshan/beiyuedian',
        southeast: 'fb/hengshan/guolaoling',
    };
}
