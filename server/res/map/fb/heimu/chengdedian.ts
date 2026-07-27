import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '承德殿';
    desc = '承德殿金碧辉煌，教众旗幡排列两侧，杨莲亭负手站在大殿中央。';
    exits = {
        west: 'fb/heimu/damen',
        east: 'fb/heimu/houdian',
    };

    constructor() {
        super();
        this.set_npc('fb/heimu/yanglianting');
    }
}
