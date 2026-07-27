import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '铜殿内部';
    desc = "殿内铜壁光可鉴人，五名禅师守着中央石台上的<cmd cmd='look jade'>和氏璧</cmd>，徐子陵亦在一旁。";
    exits = {
        south: 'fb/jingnian/tongdian',
    };

    constructor() {
        super();
        this.set_npc(['fb/jingnian/tongdianchanshi', 5]);
        this.set_npc('fb/jingnian/xuziling');
        this.set_item('jade', '和氏璧', '击败铜殿五名禅师后，盗帅线或邪王线可拿起和氏璧。', [['take', '拿起和氏璧', this.take]]);
    }

    take(me: USER) {
        const route = this.fb_query_temp('jingnian_route', me, '');
        if (!['daoshuai', 'xiewang'].includes(route)) return me.notify('你所选路线并非从铜殿直接取璧。');
        if (this.is_here('fb/jingnian/tongdianchanshi')) return me.notify('铜殿五名禅师仍守着和氏璧。');
        this.fb_set_temp('jingnian_hebi', true, me);
        me.notify('你从石台上拿起和氏璧，随即返回钟楼准备跃入长生门。');
    }
}
