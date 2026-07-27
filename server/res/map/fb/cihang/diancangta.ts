import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '典藏塔';
    desc = '塔中书架直抵穹顶，卷册间萦绕淡淡墨香。靳冰云守着一封遗书，似在等候来寻浪翻云的人。';
    exits = {
        north: 'fb/cihang/tingyu',
    };

    constructor() {
        super();
        this.set_npc('fb/cihang/jinbingyun');
    }
}
