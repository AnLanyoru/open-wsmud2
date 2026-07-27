import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '三弯九倒';
    desc = '山路在峭壁间反复盘折，石阶陡滑难行，东下方一条岔路隐约通向上清宫。';
    exits = {
        south: 'fb/qingcheng/gulongqiao',
        eastdown: 'fb/qingcheng/shangqing',
    };

    constructor() {
        super();
        this.set_npc('fb/qingcheng/dizi');
    }
}
