import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '险峻山道';
    desc = '山道凿在峭壁之上，脚边便是万丈深谷，两名太保并肩封锁了狭窄去路。';
    exits = {
        southdown: 'fb/songshan/dadian',
        northeast: 'fb/songshan/tieliang',
    };

    constructor() {
        super();
        this.set_npc(['fb/songshan/taibao5', 2]);
    }
}
