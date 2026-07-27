import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '上清宫';
    desc = '宫门古朴庄严，檐角铜铃随风轻响，西上石径接回三弯九倒，北面直通松风观。';
    exits = {
        westup: 'fb/qingcheng/sanwan',
        north: 'fb/qingcheng/songfeng',
    };
}
