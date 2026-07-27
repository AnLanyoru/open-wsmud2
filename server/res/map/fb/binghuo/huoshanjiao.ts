import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '火山脚下';
    desc = '火山在头顶隆隆震动，滚烫碎石不时沿山坡落下，灼热红光照亮西侧陡坡。';
    exits = {
        east: 'fb/binghuo/yslu2',
        west: 'fb/binghuo/huoshan1',
    };
}
