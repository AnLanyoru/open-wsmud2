import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '山路';
    desc = '石阶贴着峭壁蜿蜒向上，山风卷起细沙，远处隐约传来兵刃撞击声。';
    exits = {
        east: 'fb/guangming/zhandao',
        northwest: 'fb/guangming/banshanting',
    };
}
