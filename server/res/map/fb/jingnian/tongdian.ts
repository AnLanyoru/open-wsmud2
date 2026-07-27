import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '铜殿';
    desc = "整座殿宇以精铜铸成，沉重<cmd cmd='look door'>铜门</cmd>紧闭，门后便是供奉和氏璧的铜殿内部。";
    exits = {
        north: 'fb/jingnian/diannei',
        southdown: 'fb/jingnian/baishi',
    };

    constructor() {
        super();
        this.set_item('door', '铜门', '盗帅线需九千总臂力，邪王线需一万总臂力才能推开。僧王线在黑影提示后可直接追入。', [['push', '推开铜门', this.push]]);
    }

    push(me: USER) {
        const route = this.fb_query_temp('jingnian_route', me, '');
        if (route === 'sengwang') {
            if (!this.fb_query_temp('jingnian_bell', me, false)) return me.notify('你还没有在钟楼等到黑影扑向铜殿。');
        } else {
            const need = route === 'daoshuai' ? 9000 : 10000;
            if (!['daoshuai', 'xiewang'].includes(route)) return me.notify('你所选路线不从铜门进入。');
            if (me.str + me.query_prop('str') < need) return me.notify(`你的总臂力不足${need}，推不开沉重铜门。`);
        }
        this.fb_set_temp('jingnian_door', true, me);
        me.notify('你推开铜门，铜殿内部的护法与和氏璧同时映入眼帘。');
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'north' && !this.fb_query_temp('jingnian_door', me, false)) return me.notify_fail('沉重铜门仍然紧闭。');
    }
}
