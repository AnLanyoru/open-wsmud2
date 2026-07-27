import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '升仙坊';
    desc = '古老石坊高悬云间，匾额字迹苍劲，一名白须长老守住上山要道。';
    exits = {
        southdown: 'fb/taishan/shiba2',
        northup: 'fb/taishan/shiba3',
    };

    constructor() {
        super();
        this.set_npc('fb/taishan/yuyin');
    }
}
