import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '石门';
    desc = '甬道尽头立着一道厚重石门，门上刻着三个斗大的古篆“侠客行”。龙、木二岛主并肩守在门前。';
    exits = {
        west: 'fb/xiake/shibi',
    };

    constructor() {
        super();
        this.set_npc('fb/xiake/longdaozhu');
        this.set_npc('fb/xiake/mudaozhu');
    }
}
