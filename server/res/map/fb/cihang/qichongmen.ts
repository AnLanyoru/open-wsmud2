import type { USER } from '../../../../core/char/user.js';
import { ROOM } from '../../../../core/room/room.js';

export default class extends ROOM {
    name = '七重门';
    desc = "七道石门上分别刻着<cmd cmd='look seven_sufferings'>生、老、病、死、爱别离、怨憎会、求不得</cmd>。攻略明确说明路线不固定，只能从门上辨认。";
    exits = {
        north: 'fb/cihang/shanyao',
        south: 'fb/cihang/guangchang',
    };

    constructor() {
        super();
        this.set_item('seven_sufferings', '七苦石门', '七苦次序并不固定，此处不臆造固定排列；辨明七苦后选择攻略明确记载的称号路线。', [
            ['langzi', '选择浪子线', this.langzi],
            ['guoshi', '选择国师线', this.guoshi],
            ['jianmo', '选择剑魔线', this.jianmo],
            ['moshi', '选择魔师线', this.moshi],
        ]);
    }

    choose(me: USER, route: string) {
        const diff = this.fb_query_temp('diff', me, 0);
        const allowed = diff === 1 ? ['jianmo', 'moshi'] : ['langzi', 'guoshi'];
        if (!allowed.includes(route)) return me.notify(diff === 1 ? '困难慈航静斋只开放剑魔线与魔师线。' : '普通慈航静斋只开放浪子线与国师线。');
        const chosen = this.fb_query_temp('cihang_route', me, '');
        if (chosen && chosen !== route) return me.notify('你已经选定其他路线，无法中途更换。');
        this.fb_set_temp('cihang_route', route, me);
        me.notify(`你穿过七苦石门，选定${route === 'langzi' ? '浪子' : route === 'guoshi' ? '国师' : route === 'jianmo' ? '剑魔' : '魔师'}线。`);
    }

    langzi(me: USER) {
        this.choose(me, 'langzi');
    }

    guoshi(me: USER) {
        this.choose(me, 'guoshi');
    }

    jianmo(me: USER) {
        this.choose(me, 'jianmo');
    }

    moshi(me: USER) {
        this.choose(me, 'moshi');
    }

    on_leave(me: USER, dir: string) {
        if (dir === 'south' && !this.fb_query_temp('cihang_route', me, '')) return me.notify_fail('须先辨明七苦并选择符合当前难度的路线。');
    }
}
